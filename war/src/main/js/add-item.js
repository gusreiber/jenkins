// Initialize all modules by requiring them. Also makes sure they get bundled (see gulpfile.js).
var $ = require('jquery-detached').getJQuery();

var getItems = function(root){
  var d = $.Deferred();
  $.get(root+'/categories?depth=3').done(
      function(data){
        d.resolve(data);
      }
  );
  return d.promise();
}; 

var jRoot = $('head').attr('data-rooturl');

$.when(getItems(jRoot)).done(function(data){
  $(function() {
    
    //////////////////////////////
    // helpful reference DOM

    var defaultMinToShow = 2;
    var defaultLooseItems = 'jenkins.category.uncategorized';
    var $root = $('#main-panel');
    var $form = $root.find('form[name="createItem"]').addClass('jenkins-config new-view');
    var $newView = $('<div class="new-view" />')
      .attr('name','createItem')
      .attr('action','createItem')
      .prependTo($form);
    var $tabs = $('<div class="jenkins-config-widgets" />').appendTo($newView);
    var $categories = $('<div class="categories" />').appendTo($newView);
    var $subBtn = $('#bottom-sticker .yui-submit-button');
    var sectionsToShow = [];    

    ////////////////////////////////
    // mark page for layout
    if($('#j-welcome-box').length === 0){
      $('body').addClass('add-item');
      setTimeout(drawShowHide,200);
    }
    else{
      $('body').addClass('welcome');
    }
    
    ////////////////////////////////
    // submit button click
    
    $subBtn.on('click',function(e){
      var $this = $(this).addClass('yui-button-disabled yui-submit-button-disabled')
        .find('button')
          .attr('disabled','disabled')
          .text('. . .')   
    });
    
    ////////////////////////////////
    // scroll action......
    
    function watchScroll(){
      var $window = $(window);
      var $jenkTools = $('#breadcrumbBar');
      var winScoll = $window.scrollTop();
      var jenkToolOffset = $jenkTools.height() + $jenkTools.offset().top + 15;

      $tabs.find('.active').removeClass('active');
      $.each(data.categories,function(i,cat){
        var domId = '#j-add-item-type-'+cat.id;
        var $cat = $(domId);
        var catHeight = ($cat.length > 0)?
            $cat.offset().top + $cat.outerHeight() - (jenkToolOffset + 100):
              0;

        if(winScoll < catHeight){
          var $thisTab = $tabs.find(['[href="',cleanHref(domId),'"]'].join(''));
          resetActiveTab($thisTab);
          return false;
        }
      });
      
      if(winScoll > $('#page-head').height() - 5 ){  
        $tabs.width($tabs.width()).css({
          'position':'fixed',
          'top':($jenkTools.height() - 5 )+'px'});
        $categories.css({'margin-top':$tabs.outerHeight()+'px'});   
      }
      else{
        $tabs.add($categories).removeAttr('style');
      }
    }

    //////////////////////////
    // helper functions...
    
    function addCopyOption(data){
      var $copy = $('#copy').closest('tr');
      if($copy.length === 0) {return data;} // exit if copy should not be added to page. Jelly page holds that logic.
      var copyTitle = $copy.find('label').text();
      var copyDom = $copy.next().find('.setting-main').html();
      var copy = {
          name:'Copy',
          id:'copy',
          minToShow:0,
          items:[
            {
              class:"copy",
              description:copyDom,
              displayName:copyTitle,
              iconFilePathPattern:'images/items/copy.png'
            }
          ]
      };
      var newData = [];
      
      $.each(data,function(i,elem){
        if(elem.id !== "category-id-copy")
          { newData.push(elem); }
      });
      
      newData.push(copy);

      
      return newData;
    }
    
    function sortItemsByOrder(itemTypes) {
      function sortByOrder(a, b) {
        var aOrder = a.weight;
        var bOrder = b.weight;
        return ( (aOrder < bOrder) ? -1 : ( (aOrder === bOrder) ? 0 : 1));
      }
      return itemTypes.sort(sortByOrder);
    }
    
    function hideAllTabsIfUnnecesary(sectionsToShow){
      if(sectionsToShow.length < 2){
        $tabs.find('.tab').hide();
        $categories.find('.category-header').hide();
      }        
    }
    
    function checkCatCount(elem){
      var minToShow = (typeof elem.minToShow === 'number')? elem.minToShow : defaultMinToShow;
      var showIt = ($.isArray(elem.items) && elem.items.length >= minToShow);
      return showIt;
    }
    
    function cleanClassName(className){
      return className.replace(/\./g,'_');
    }
    
    function cleanHref(id,reverse){
      if(reverse){
        var gotHash = (id.indexOf('#') === 0)? 
           '#j-add-item-type-'+ id.substring(1).replace(/\./g,'_'):
             'j-add-item-type-'+ id.replace(/\./g,'_');
        return gotHash;
      }
      else{
        return id.replace('j-add-item-type-','');
      }
    }
    
    function cleanLayout(){
      console.log('????????????????');
      // Do a little shimmy-hack to force legacy code to resize correctly and set tab state.
      $('html,body').animate({scrollTop: 1}, 1);
      $('html,body').animate({scrollTop: 0}, 10);

      setTimeout(fireBottomStickerAdjustEvent,410);
    }
    
    function resetActiveTab($this){
      var $nav = $this.closest('.nav');
      $nav.find('.active').removeClass('active');
      $this.addClass('active');
    } 
    
    //////////////////////////////////
    // Draw functions
    
    function drawName() {
      var $name = $('<div class="j-add-item-name" />');

      var $input = $('<input type="text" name="name" class="name" id="name" placeholder="New item name..." />')
        .change(function(){
          $form.find('input[name="name"]').val($(this).val());
          window.updateOk($form[0]);
        })
        .appendTo($name);
      
      $tabs.prepend($name);
      setTimeout(function(){$input.focus();},100);
    }    
    
    function drawTabs(data){
      $('#main-panel').addClass('container');
      var $navBox = $('<nav class="navbar navbar-default navbar-static form-config tabBarFrame"/>');
      var $nav = $('<ul class="nav navbar-nav tabBar config-section-activators" />');
      
      $.each(data,function(i,elem){

        // little bit hacky here... need to keep track if I have tabs to show, so if there is just 1, I can hide it later....
        if (elem.minToShow !== 0 && checkCatCount(elem)) {sectionsToShow.push(elem.id);}
        
        var $tab = drawTab(i,elem);
        var $items = drawCategory(elem);
        var $cat = $items.parent();
        
        $.each(elem.items,function(i,elem){
          var $item = drawItem(elem);
          $items.append($item);
        });
        
        if(checkCatCount(elem)) {$nav.append($tab);}
        $categories.append($cat);

      });
      $(window).on('scroll',watchScroll);
   
      if(sectionsToShow.length > 1){
        $navBox.append($nav);
        $tabs.prepend($navBox);
      }else{
        $categories.find('.category-header').hide();
      }
      drawName();
      cleanLayout();
    }

    function drawTab(i,elem){
      if(!elem) {elem = i;}
      var $tab = $(['<li><a class="tab ',((i===0)?'active':''),'" href="#',cleanHref(elem.id),'">',elem.name,'</a></li>'].join(''))
        .click(function(){
          //e.preventDefault(e);
          var $this = $(this).children('a');
          
          var tab = $this.attr('href');
          var scrollTop = $(cleanHref(tab,true)).offset().top - ($newView.children('.jenkins-config-widgets').height() + 15);
          
          setTimeout(function(){resetActiveTab($this);},510);
          
          $('html,body').animate({
            scrollTop: scrollTop
          }, 500);
        });
      return $tab;
    }

    function drawCategory(i,elem){
      // categories are smart, so this is a little tricky....
      if (!elem) elem = i;
      var $category = $('<div/>').addClass('category jenkins-config hide-cat').attr('id', 'j-add-item-type-'+cleanClassName(elem.id));
      var $items = $('<ul/>').addClass('j-item-options').appendTo($category);
      
      // if there are enough items for a category, attach the category and its header...
      if(checkCatCount(elem)){
        var $catHeader = $('<div class="category-header" />').prependTo($category);
        var catheader = ['<h2>', elem.name, '</h2>'].join('');
        var catDesc = ['<p>', elem.description, '</p>'].join('');
        
        if((elem.minToShow > 0)){
          $(catheader).appendTo($catHeader);
          $(catDesc).appendTo($catHeader);
        }
        $category.removeClass('hide-cat');
      }
      else{
        var targ = elem.remainders || defaultLooseItems;
        $items = $('#'+cleanHref(targ,true)).find('.j-item-options');
      }

      return $items;
    }
    
    function drawItem(elem){
      var $item = $([
          '<li class="',cleanClassName(elem.class),'"><label><input name="mode" value="',elem.class,'" type="radio" /> <span class="label">', elem.displayName, '</span></label></li>'
      ].join('')).append([
          '<div class="desc">', elem.description, '</div>'
      ].join('')).append(drawIcon(elem));

      function setSelectState(){
        var $this = $(this).closest('li');
        //if this is a hyperlink, don't move the selection.
        if($this.find('a:focus').length === 1) {return false;}
        $this.closest('.categories').find('.active').removeClass('active');
        $this.addClass('active');
        $this.find('input[type="radio"]').attr('checked', 'checked');
        window.updateOk($form[0]);
        
        $('html, body').animate({
          scrollTop:$this.offset().top - 200
        },50);
        
      }
      
      $item.click(setSelectState);
      
      return $item;
    }
    
    function drawIcon(elem){
      var $icn = $('<div class="icn">');
      if (!elem.iconFilePathPattern) {
        var name = elem.displayName;
        var aName = name.split(' ');
        var a = name.substring(0,1);
        var b = ((aName.length === 1)?
            name.substring(1,2):
              aName[1].substring(0,1));
        var $defIcon = $([
          '<span class="dfIcn"><span class="a">',a,'</span><span class="b">',b,'</span></span>'
         ].join(''))
          .appendTo($icn);
        return $icn.addClass('df');
      }
      
      var iconFilePath = jRoot + '/' + elem.iconFilePathPattern.replace(":size", "48x48");
      var iconDom = $(['<span class="img" style="background:url(', iconFilePath, ')"></span>'].join(''))
        .appendTo($icn);

      return $icn;
    }
    
    function drawShowHide(){
      var $body = $('body').addClass('hide-side j-hide-left');
      var $toggle = $('<div class="toggle slide-in" />')
        .prependTo('#main-panel')
          .click(function(){
            $body.toggleClass('j-hide-left');
            fireBottomStickerAdjustEvent();
          });
      setTimeout(function(){
        $toggle.removeClass('slide-in'); 
      },10);
      
    }
    
    // initialize
    
    var sortedDCategories = sortItemsByOrder(data.categories);
    var sortedDCategoriesWithCopy = addCopyOption(sortedDCategories);
    drawTabs(sortedDCategoriesWithCopy);
    
  });
});

function fireBottomStickerAdjustEvent() {
  Event.fire(window, 'jenkins:bottom-sticker-adjust'); // jshint ignore:line
}