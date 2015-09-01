(function($){   
  $(document).ready(function(){
    var SortableTable = jq2_1_3.SortableTable;
    
    var danielGroups = [
        {
          header:{
            id:'scm',
            title:'SCM Connectors',
            description:'Connect Jenkins to your source code manager'
          },          
          items:[
             {id:'bitbucket',icon:'https://www.vectorbase.org/sites/default/files/ftp/Landing_page_icons/Downloads_icons/bitbucket_logo.png'},
             {id:'clearcase', icon:'https://jazz.net/wiki/pub/Deployment/RationalTeamConcertAndRationalClearCaseIntegrationCookbook/rcc-155.png'},
             {id:'cvs',icon:'https://www.wyolution.com/wp-content/uploads/2008/10/cvs-logo.png'},
             {id:'gerrit-trigger', icon:'http://www.onyxpoint.com/wp-content/uploads/2015/03/diffymute-300x279.png'},
             {id:'git', icon:'http://s3.amazonaws.com/cloud.ohloh.net/attachments/72402/Git-Icon-1788C_med.png'},
             {id:'github', icon:'https://lh6.googleusercontent.com/proxy/dU2HgAidA17VqD07RNslVjtpXCtogQCWylSyptACYSweFvdkjmgSBho07ON-JimKD3dcXd7_wUVWpy1QS79POsUXF2dT3HNIyvLqLMUgQjO9tvSo-3t60HgF97SlPWnZShif2De9q1rbHjpyLXvQ_Q=w120-h120'},
             {id:'gitlab-hook', icon:'https://lh5.googleusercontent.com/proxy/PBJrJJbAl4L9WyPb_ZsQpvftUJFTjmCyRZDdQcTaPDoX4-hkrF9ojU6kKHkS4SWxKKHXNm8dnAR50mbEYwU=w120-h120'},
             {id:'ghprb',icon:'https://lh3.googleusercontent.com/-gY3ZFpk1_Os/AAAAAAAAAAI/AAAAAAAALFo/Sv6-A7WTdRg/s120-c/photo.jpg'},
             {id:'gitlab-plugin', icon:'https://avatars3.githubusercontent.com/u/12074909?v=3&s=120'},
             {id:'mercurial', icon:'http://www.yellosoft.us/public/images/hg.png'},
             {id:'perforce', icon:'http://www.jaimerios.com/wp-content/uploads/2015/03/perforce-small-logo.png'},
             {id:'subversion',icon:'https://www.atagar.com/nocNorade/images/section_subversion.png'}             
             ]
        },
        {
          header:{
            id:'build',
            title:'Build and Analysis',
            description:'Select build helpers and test integration packages'
          },          
          items:[
             {id:'ant', icon:'http://techinfoteam.com/wp-content/uploads/2015/01/554px-Apache-Ant-logo.svg_-375x195.png'},
             {id:'gradle', icon:'https://jbs.io/images/stack/gradle.png'},
             {id:'groovy',icon:'http://eudev2.uta.cl/?thumbnail=1M8682YP1-1MNG2MR-1TF'},
             {id:'maven-plugin', icon:'http://a3ab771892fd198a96736e50.javacodegeeks.netdna-cdn.com/wp-content/uploads/2012/10/apache-maven-logo.jpg'},
             {id:'msbuild', icon:'http://icons.iconarchive.com/icons/dakirby309/simply-styled/256/Microsoft-Visual-Studio-icon.png'},
             {id:'nodejs', icon:'http://www.nodeclipse.org/img/logos/Node-JS-logo.png'},
             {id:'powershell', icon:'http://i1.wp.com/devblackops.io/wp-content/uploads/2015/03/PowerShell-logo1-e1426698028899.png?resize=65%2C65'},
             {id:'analysis-collector', icon:'http://www.redtreerobotics.com/wp-content/themes/redtree/img/data.png'},
             {id:'checkstyle', icon:'https://avatars1.githubusercontent.com/u/5179750?v=3&s=84'},
             {id:'cobertura', icon:'http://s3.amazonaws.com/cloud.ohloh.net/attachments/1183/java_library_med.png'},
             {id:'javadoc',icon:'http://agentdero.cachefly.net/continuousblog/duke-construction.gif'},
             {id:'junit',icon:'http://a3ab771892fd198a96736e50.javacodegeeks.netdna-cdn.com/wp-content/uploads/2012/10/junit-logo.jpg'},
             {id:'pmd', icon:'https://avatars1.githubusercontent.com/u/1958157?v=3&s=64'},
             {id:'sonar', icon:'https://structure101.com/static-content/images/product-icons/sonar.png'},
             {id:'xunit', icon:'https://d21ii91i3y6o6h.cloudfront.net/gallery_images/from_proof/4404/large/1425068890/xunit-dot-net-small-logo.png'}
             ]
        },
        {
          header:{
            id:'deploy',
            title:'Deployment',
            description:'Push packages to production and track artifacts and get post build notifications'
          },          
          items:[
            {id:'deploy', icon:'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_publish_48px-128.png'},
            {id:'email-ext', icon:'http://www.zenbership.com/imgs/extensions/icon-email.png'},
            {id:'flexible-publish', icon:'http://cdn-img.easyicon.net/png/11581/1158129.gif'},
            {id:'htmlpublisher', icon:'http://www.omicronsolution.com/images/logo-html.png'},
            {id:'instant-messaging', icon:'http://cdn.appappeal.com/pictures/12556/logo.png'},
            {id: 'jabber', icon:'http://www.freezy.cz/data/icon_jabber.png'},
            {id: 'jira', icon:'https://marketplace-cdn.atlassian.com/files/images/f7a34752-e211-4b23-a8f7-e461c7a1f382.png'},
            {id: 'mailer', icon:'http://www.southshoremoves.com/assets/mail-fe6de721354e42bc0350062dd6bec247.png'},
            {id: 'publish-over-ssh', icon:'http://www.eguardian.com/wp-content/uploads/2015/02/logo-ssh.jpg'},
            {id:'redmine', icon:'https://bitbucket-assetroot.s3.amazonaws.com/c/photos/2012/Nov/06/redmine-all-logo-3391705615-6_avatar.png'},
            {id:'slack', icon:'https://int-dir.s3.amazonaws.com/uploads/2316_2316_huge-slack-logo-with-transparency.png'}

             ]
        },
        {
          header:{
            id:'pipelines',
            title:'Pipelines',
            description:'Master continuous delivery and manage your complete build and deployment process'
          },          
          items:[
            {id:'build-pipeline-plugin', icon:'http://newairplumbing.com/wp-content/uploads/2014/10/sewer-repair.png'},
            {id:'conditional-buildstep', icon:'http://www.mikrokopter.de/files/large/a55e8118728c7a1'},
            {id:'copyartifact', icon:'http://static1.squarespace.com/static/512f7f28e4b0e0699d176018/t/5316f063e4b0cc8a5401a0d6/1394012260426/iconmonstr-copy-7-icon-256.png'},
            {id:'parameterized-trigger', icon:'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/256/variable.png'},
            {id:'workflow-aggregator', icon:'http://cdn2.hubspot.net/hub/277442/file-352535420-png/Icon/Workflow.png?t=1402633182140'}
             ]
        },
        {
          header:{
            id:'containers',
            title:'Containers',
            description:'Distribute your process workloads and precisely package your test environments'
          },          
          items:[
            {id:'docker-build-publish', icon:'http://brunorocha.org/mediafiles/image/2015/7/26da7b36ff8bb5db4211400358dc7c4e_10937.png'},
            {id:'docker-build-step', icon:'http://brunorocha.org/mediafiles/image/2015/7/26da7b36ff8bb5db4211400358dc7c4e_10937.png'},
            {id:'docker-plugin', icon:'https://pbs.twimg.com/profile_images/378800000124779041/fbbb494a7eef5f9278c6967b6072ca3e_400x400.png'},
            {id: 'matrix-project', icon:'http://icons.iconarchive.com/icons/iconsmind/outline/128/Cube-Molecule-icon.png'},
            {id:'ssh-slaves', icon:'http://plainicon.com/dboard/userprod/2800_a1826/prod_thumb/plainicon.com-50326-256px-6bd.png'},
            {id:'windows-slaves', icon:'https://cdn3.iconfinder.com/data/icons/picons-social/57/72-windows8-128.png'}
             ]
        },
        {
          header:{
            id:'security',
            title:'Users and Security',
            description:'Provide fine grain user access while maintaining system security'
          },          
          items:[
            {id:'active-directory', icon:'https://oddytee.files.wordpress.com/2014/09/azure-active-directory.png'},
            {id:'github-oauth', icon:'https://support.wombat.co/hc/en-us/article_attachments/200788874/github_icon.png'},
            {id:'ldap', icon:'http://www.haotu.net/up/2836/128/active_directory.png'},
            {id:'pam-auth', icon:'https://d30y9cdsu7xlg0.cloudfront.net/png/4032-84.png'},
            {id:'matrix-auth',icon:'http://icons.iconarchive.com/icons/iconsmind/outline/128/Cube-Molecule-icon.png'}
             ]
        },
        {
          header:{
            id:'general',
            title:'General Purpose',
            description:'Additional tools to expidite your build automation process'
          },          
          items:[
            {id:'ansicolor', icon:'http://img.brothersoft.com/icon/softimage/s/shades_color_picker-314075-1261335443.jpeg'},
            {id:'build-timeout', icon:'http://www.redtreerobotics.com/wp-content/themes/redtree/img/realtime.png'},
            {id:'embeddable-build-status', icon:'http://findicons.com/files/icons/2711/free_icons_for_windows8_metro/128/checked_checkbox.png'},
            {id:'envinject', icon:'https://thereitis.org/tii-content/uploads/2014/12/code-icon.png.png'},
            {id:'next-build-number', icon:'http://megaicons.net/static/img/icons_title/8/178/title/numbers-3-filled-icon.png'},
            {id:'rebuild', icon:'http://www.clker.com/cliparts/L/3/R/J/g/B/reload-icon-hi.png'},
            {id:'sidebar-link', icon:'http://freeiconbox.com/icon/256/3930.png'},
            {id:'simple-theme-plugin', icon:'https://cdn3.iconfinder.com/data/icons/streamline-icon-set-free-pack/48/Streamline-17-512.png'},
            {id:'timestamper', icon:'https://image.freepik.com/free-photo/events-calendar_318-31286.jpg'},
            {id:'translation', icon:'https://d30y9cdsu7xlg0.cloudfront.net/png/16718-84.png'},
            {id:'ws-cleanup', icon:'http://icons.iconarchive.com/icons/icons8/windows-8/128/Household-Broom-icon.png'},
            {id:'antisamy-markup-formatter', icon:'https://www.netsparker.com/s/r/bl/OWASP%20Logo.png'},
            {id:'cloudbees-folder', icon:'http://icons.iconarchive.com/icons/icons8/ios7/256/Very-Basic-Opened-Folder-icon.png'},
            {id:'compact-columns', icon:'http://freeiconbox.com/icon/256/36692.png'},
            {id:'dashboard-view', icon:'http://www.a-w.com/typo3temp/fl_realurl_image/dashboard-icon-da-1.png'},
            {id:'disk-usage', icon:'http://findicons.com/files/icons/1580/devine_icons_part_2/128/hdd_2.png'},
            {id:'extra-columns', icon:'https://image.freepik.com/free-photo/insert-column_318-80027.jpg'},
            {id:'jobConfigHistory', icon:'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_history_48px-128.png'},
            {id:'monitoring', icon:'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/512/glasses-.png'},
            {id:'view-job-filters',icon:'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/128/empty_filter.png'}
             ]
        }
        
    ];
    
    function sizeWindow(){
      var $pageBody = $('#page-body');
      var $globalMenu = $('#top-sticker-box')
      var $leftMenu = $('#left-pegged-nav');
      var $topMenu = $('#top-pegged-nav');
      var $container = $('#main-pegged-container');
      var $footer = $('#do-actions');
      var $header = $('#top-pegged-header');
      var $updateNotice = $('#plugin-update-notice');
      var bodyWidth = $container.width();
      var leftMarginWidth = $leftMenu.outerWidth();
      if(leftMarginWidth > 175 ) leftMarginWidth = 0;
      
      
      $container.css({'padding':'0 0 0 '+leftMarginWidth+'px'}).css({'top':$topMenu.outerHeight()+'px'});
      $header.width(bodyWidth).css({'padding-left':leftMarginWidth});
      $footer.width(bodyWidth);

      setTimeout(function(){
        $globalMenu.prev().height($globalMenu.outerHeight());
        menuOffset = $pageBody.offset().top + 10;
        $leftMenu.css({'top':menuOffset,'position':'fixed'});
        $header.css({'top':menuOffset,'position':'fixed'});
      },1);
      
    }
    
    function finishAction(){
      var thisObj = this;
      $('#outer-plugin-box').css({'opacity':1});
      var $globalMenu = $('#top-sticker-box')
      var $leftMenu = $('#left-pegged-nav').css({'opacity':1});
      var $topMenu = $('#top-pegged-nav');      
      var $header = $('#top-pegged-header');
      var $container = $('#main-pegged-container'); 
      var $pageBody = $('#page-body').addClass('hide-overflow')
      var $h1 = $header.children('h1').removeAttr('style');
      var topHeight = $topMenu.outerHeight();
      var globalHeight = $globalMenu.outerHeight() + 10;
      var menuOffset = $pageBody.offset().top;
      
      // make window scroll pegging work...
      $(window).scroll(function(){
        $globalMenu.prev().height($globalMenu.outerHeight());
        var scroll = $('body').scrollTop();
        if(scroll > 0 ){ 
          globalHeight = $globalMenu.outerHeight() + 10;
          $h1.css({'padding':0,'margin':0,'height':0});
          $leftMenu.css({'top':globalHeight,'position':'fixed'});
          $header.css({'top':globalHeight,'position':'fixed'});
        }
        
        else{
          menuOffset = $pageBody.offset().top + 10;
          $h1.removeAttr('style');
          $leftMenu.css({'top':menuOffset});
          $header.css({'top':menuOffset});
        }
        
      });
      
      
      //make scrollspy reflect state....
      $('body').scrollspy({ target: '#grid-scrollspy',offset:menuOffset + 170});
      
      $('#grid-scrollspy').on("activate.bs.scrollspy", function (e) {
        var $currentNav = $(".nav li.active > a")
        var $currentSec = $($currentNav.attr('href'));
        $currentSec.parent().children().removeClass('active');
        $currentSec.addClass('active');

      });
      
      //activeate scrollspy and set offsets....
      $('#grid-scrollspy li a').click(function(event) {
        
        function doMove(){
          $h1.css({'padding':0,'margin':0,'height':0});
          $section.next().show().removeClass('closed');
          menuOffset = $pageBody.offset().top + 10;
          var offset = -($header.offset().top + $header.outerHeight());
          $section[0].scrollIntoView();        
          scrollBy(0,  - (menuOffset));          
        }
        
        event.preventDefault();
        var $this = $(this);
        var $section = $($this.attr('href')).removeClass('closed');
        $this.closest('.navbar').find('#filter-options li.active').removeClass('active');
        
        if(thisObj && thisObj.groupByVal === null){
          thisObj.sortBy('title',thisObj.getCol('categories'),false);
        }else
          setTimeout(doMove,10);
      });

      //attach update message...
      var updates = thisObj.$target.find('.grid-item.hasUpdate').length;
      if(updates > 0){
        var $notice = $([
              '<div id="plugin-update-notice" class="alert alert-info alert-dismissible" role="alert">',
              '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>',
              '<div class="btn-group btn-group-sm">',
                '<button type="button" id="view-all-updates" class="btn btn-primary">View and select</button>',
                '<button type="button" class="btn btn-default">Install all</button>',
              '</div> ',
              ' You have <strong>',updates,'</strong> plugins that can be updated.',
        
              '</div>'
        ].join('')).appendTo($globalMenu);
        $notice.find('button.close').click(sizeWindow);
        $notice.find('#view-all-updates').click(function(){
          $leftMenu.find('.haveUpdates a').trigger('click')})
        sizeWindow();
      }
    }
    
    function selectAction(e,row){
      e.preventDefault();
      var $item = $(e.target).closest('.grid-item');
      if($item.hasClass('installed') && !$item.hasClass('hasUpdate')) return false;        
      
      $item.toggleClass('slct');
      var $grid = $item.closest('.grid');
      var selectedItems = $grid.find('.grid-item.slct');
      if(selectedItems.length > 0) $('#do-actions').css({'bottom':'-1px'})
      else $('#do-actions').css({'bottom':'-100px'})
      sizeWindow();
    }
    
    function getUpdateCenters(){
      return $.get(resURL + '/updateCenter/api/json?depth=3');
    }
    function getPluginManager(){
      return $.get(resURL + '/pluginManager/api/json?depth=3');
    }
    
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function getPlugins(){
      var dfd = $.Deferred();
      
      var updateCenters = getUpdateCenters();
      var pluginManager = getPluginManager();
      $.when(updateCenters,pluginManager).done(function(res1,res2){
        var sites = res1[0].sites;
        var installed = res2[0].plugins;
        var uniquePluginUrls = [];
        var plugins = [];
        var enableryUrls = [];
        
        function addStuff(plugin,thisSection,item){
          plugin.title = $.trim(plugin.title.replace('Jenkins','').replace('Hudson','').replace('Plugin','').replace('plugin','').replace('Plug-in',''));
          plugin.hasUpdate = (plugin.hasUpdate)?true:false;
          plugin.maintainer = '<a href="#">Maintainer Name</a>';
          plugin.updated = moment().subtract(getRandomInt(100,5000),'hours'); 
          plugin.created = moment().subtract(getRandomInt(5000,15000),'hours');    
          plugin.installs = getRandomInt(5000,120000);
          plugin.meta = thisSection;          
          plugin.rating = getRandomInt(2,5);
          plugin.icon = ['<img src="',item.icon,'" />'].join('');
          return plugin;
        }

        // fetch in the context of Daniel's groupping of plugins to show....
        $.each(danielGroups,function(){
          var thisSection = this.header;
          $.each(this.items,function(i,item){
            var thisId = item.id;
            
            // fetch all the updateCenters plugins...
            $.each(sites,function(i,site){
              $.each(site.availables,function(i,plugin){
                var url = plugin.url;                
                if(uniquePluginUrls.indexOf(url) < 0 && plugin.name === thisId){
                  uniquePluginUrls.push(url);

                  plugins.push(addStuff(plugin,thisSection,item));
                }
              });
            });
            
            // check to see if any are installed...
            $.each(installed,function(i,inPlugin){
              if(thisId !== inPlugin.shortName) return;
              var installedUrl = inPlugin.url;
              var notAvailable = false;
              $.each(plugins,function(i,plugin){
                var url = plugin.url;
                
                if(installedUrl === url){
                  // add the installation attributes to plugin...
                  plugin.name = inPlugin.shortName
                  plugin.name = inPlugin.shortName;
                  plugin.installed = true;
                  plugin = addStuff(plugin,thisSection,item);
                }
                else{
                  notAvailable = true;
                }            
              });
              
              if(notAvailable){
                inPlugin.title = inPlugin.longName;
                inPlugin.name = inPlugin.shortName;
                inPlugin.neededDependencies = inPlugin.dependencies;
                inPlugin.categories = ['lost in translation'];
                inPlugin.excerpt = 'Lost excerpt because installed...';
                inPlugin.installed = true;
                inPlugin = addStuff(inPlugin,thisSection,item);
                plugins.push(inPlugin);

              }
              
            });
            
          });
        });
        
        dfd.resolve(plugins);
        
      });
      
      return dfd.promise();
    };
    
    function drawDependencies(val,row,gridObj,tmpClassName,tmpReturnAsString){
      var returnString = 'none';
      if($.isArray(val) && val.length > 0 && val[0]){
        returnString = [];
        $.each(val,function(){
          returnString.push((typeof this === 'string')?this:this.title);
        });
        return returnString.join();
      }
      else
        return returnString;
    }
    function drawGroups(val,rows){
      var dom = [
       '<h3>',val.title,'</h3><p class="description">',val.description,'</p>'
       ].join('');
      return dom;
    }
    
    function drawMeta(val){
      return [
              '<h3>',val.title,'</h3><p class="description">',val.description,'</p>'
              ].join('');
    }
    function drawDate(val){
      return moment(val).format('l');
    }
    function drawAgo(val){
      return moment(val).fromNow();
    }
    function drawDetails(event,row,fullData){
      var path = row.cells[0].path;
      var value = row.cells[0].value;
      var full;
      $.each(fullData,function(i,item){
        if(item[path] === value){
          full = item;
          return false;
        }  
      });
      var dependenciesDom = [];
      $.each(full.neededDependencies,function(i,plugin){
        dependenciesDom.push([
                              '<li class="value dep dep-req"><a href="#">',(plugin.title || plugin.shortName),'</a> <span class="ver"> ',plugin.version,'</span></li>'
                              ].join(''));
      });
      if(full.optionalDependencies) $.each(full.optionalDependencies,function(key,val){
        dependenciesDom.push([
                              '<li class="value dep dep-opt"><a href="#">',key,'</a> <span class="ver"> ',val,'</span></li>'
                              ].join(''));
      });

      
      
      var $bsLayer = $('<div class="bootstrap3" id="hidden-overlay" />').appendTo($('body'));
      var $modal = $([
      '<div class="modal fade" id="grid-detail-modal-',value,'" tabindex="-1" role="dialog">',
      '<div class="modal-dialog ',((full.installed)?' installed ': ' available '),((full.hasUpdate)?' hasUpdate ': ' up-to-date '),'" role="document">',
        '<div class="modal-content">',
          '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '<h4 class="modal-title" id="exampleModalLabel">',full.title,' <span class="version">(',full.name,'  v.',full.version,')</span></h4>',
          '</div>',
          '<div class="modal-body">',
            '<div class="row">',
                '<div class="col-md-5">',
                  '<div class="form-group rating rating_',full.rating,'">',
                  '<div class="value">',full.rating,'</div>',
                '</div>',
                '<div class="form-group installs"><strong>',full.installs,'</strong> Installations</div>',
                
                '<div class="row">',
                '<div class="form-group col-md-6">',
                  '<label>Created</label>',
                  '<div class="value">',drawAgo(full.created._d),,'</div>',
                '</div>',
                '<div class="form-group col-md-6">',
                  '<label>Released</label>',
                  '<div class="value">',drawAgo(full.updated._d),'</div>',
                '</div>',
                '</div>',
                '<div class="form-group">',
                  '<label>Maintainers</label>',
                  '<div class="value">',full.maintainer,'</div>',
                '</div>',
                '<div class="form-group">',
                  '<div class="value">Requires Jenkins core <a href="#" class="ver">1.568</a></div>',
                '</div>',
                ((dependenciesDom.length > 0)?[
                '<div class="form-group dependencies">',
                  '<label>Dependencies</label>',
                  '<ul class="value">',dependenciesDom.join(''),'</ul>',
                '</div>',
                ].join(''):''),
              '</div>',
              '<div class="col-md-7">',
                '<div class="usage-graph">',
                '<img src="https://chart.googleapis.com/chart?cht=lc&chxl=1:%7C08%7C09%7C10%7C11%7C12%7C01%7C02%7C03%7C04%7C05%7C06%7C07%7C2:%7CMonth&chxp=2,50&chxr=0,0,3731%7C1,0,12&chxs=1,676767,12&chxt=y,x,x&chs=300x225&chds=0,3731&chd=t:2608,2729,2928,2941,2945,3104,3144,3337,3428,3451,3572,3731&chg=10,-1,0,0&chls=4&chco=d24939"/></div>',
                '<div class="description read">',full.excerpt,'</div>',
                '<div class="doc"><a target="_blank" class="btn btn-info pull-right" href="',full.wiki,'">Go to Wiki</a>',
                '</div>',
              '</div>',
            '</div>',
          '</div>',
          '<div class="modal-footer">',
            
            '<button type="button" class="btn btn-primary select">Select</button>',
            '<button type="button" class="btn btn-primary install">Install</button>',
            '<button type="button" class="btn btn-primary upgrade">Upgrade</button>',
            '<button type="button" class="btn btn-danger uninstall pull-left">Uninstall</button>',
            '<button type="button" class="btn btn-warning suspend pull-left">Suspend</button>',
            
          '</div>',
        '</div>',
      '</div>',
    '</div>'].join(''));
      
      $bsLayer.append($modal);
      $modal.modal();
      
      var html
      return html;
    }
    function drawState(row,cols,item,data){
      var rating = '';
      var installed = '';
      var hasUpdate= '';
      $.each(row.cells,function(i,cell){
        if(cell.id === 'rating') rating = 'rating_'+cell.value;
        if(cell.id === 'installed' && cell.value) 
          installed = ' installed';
        if(cell.id === 'hasUpdate' && cell.value)
          hasUpdate = ' hasUpdate';
      });
      return rating + installed + hasUpdate;
    }
    function sortDependencies(val,row,gridObj){
      var returnArray = [];
      if($.isArray(val) && val.length > 0 && val[0]){
        $.each(val,function(){
          returnArray.push((typeof this === 'string')?this:this.title);
        });
      }
      return returnArray;
    
    }
    
    var tableModel = {
      display:'tiles',
      groups:['neededDependencies','categories','hasUpdate','installed'],
      forceGroup:{
        key:'categories',
        options:['scm','build','deploy','pipelines','containers','security','general']
      },   
      toolbarTarget:'#toolbarTarget',
      rowStateClass:drawState,
      detailRenderer:drawDetails,
      groupRenderer:drawGroups,
      resizeAction:sizeWindow,
      selectAction:selectAction,
      finishAction:finishAction,
      cols:[
            {
              name:'ID',
              id:'id',
              path:'name',
              className:'hidden'
            },
            {
              name:'Title',
              id:'title',
              path:'title',
              sortable:true
            },{
              name:'Maintainer',
              id:'maintainer',
              path:'maintainer',
              sortable:true
            },{
              name:'Rating',
              id:'rating',
              path:'rating',
              sortable:true
                
            },{
              name:'Icon',
              id:'icon',
              path:'icon'
            },{
              name:'Installs',
              id:'installs',
              path:'installs',
              sortable:true
                
            },{
              name:'Version',
              id:'version',
              path:'version'
            },{
              name:'Updated',
              id:'updated',
              path:'updated',
              renderer:drawAgo
            },{
              name:'Created',
              id:'created',
              path:'created',
              renderer:drawDate
            },{
              name:'Description',
              id:'excerpt',
              path:'excerpt'
            },{
              name:'Installed',
              id:'installed',
              path:'installed',
              sortable:true
            },{
              name:'Updatable',
              id:'hasUpdate',
              path:'hasUpdate',
              storable:true
            },{
              name:'Categories',
              id:'categories',
              path:'meta',
              className:'hidden',
              renderer:drawMeta,
              sortable:true
            },
            {
              name:'Dependencies',
              id:'neededDependencies',
              path:'neededDependencies',
              renderer:drawDependencies,
              sorter:sortDependencies,
              className:'hidden'
            }

      ]
  }

    var $table = $('#grid-this-guy');
    
    getPlugins().then(function(plugins){

      function filterMenuActions(){
        var $filterMenuItem = $('#filter-options a');
        
        $filterMenuItem.each(function(i,link){
          $link = $(link);
          $link.click(function(e){
            e.preventDefault();
            var $this= $(this);
            
            $this.closest('.navbar').find('li.active').removeClass('active');
            $this.parent().addClass('active');
            
            myTable.filterBy($this.attr('href').replace('#',''),myTable);
            
          });
        });
      }
      
      var myTable = new SortableTable(tableModel,plugins,$table);
      filterMenuActions();

    });
    
    function getPlguinManager(){
      return $.get(resURL + '/pluginManager/api/json?depth=2');
      
    }
    
    
  });

})(jq2_1_3);