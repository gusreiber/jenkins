(function($){   
  $(document).ready(function(){
    var SortableTable = jq2_1_3.SortableTable;
   
    function getUpdateCenters(){
      return $.get(resURL + '/updateCenter/api/json?depth=3');
    }
    function getPluginManager(){
      return $.get(resURL + '/pluginManager/api/json?depth=3');
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
        
        // fetch all the updateCenters plugins...
        $.each(sites,function(i,site){
          $.each(site.availables,function(i,plugin){
            var url = plugin.url;
            if(uniquePluginUrls.indexOf(url) < 0 ){
              uniquePluginUrls.push(url);
              plugin.maintainer = 'Dr Hardcode';
              plugin.updated = Date.now();
              plugin.created = Date.now();    

              plugins.push(plugin);
            }
          });
        });
         
        // check to see if any are installed...
        $.each(installed,function(i,inPlugin){
          var installedUrl = inPlugin.url;
          var notAvailable = false;
          $.each(plugins,function(i,plugin){
            var url = plugin.url;
            
            if(installedUrl === url){
              // add the installation attributes to plugin...
              inPlugin.name = inPlugin.shortName;
              inPlugin.installed = true;
              inPlugin.maintainer = 'Dr Hardcode';
              inPlugin.updated = Date.now();
              inPlugin.created = Date.now(); 
            }
            else{
              notAvailable = true;
            }            
          });
          
          if(notAvailable){
            inPlugin.title = inPlugin.longName;
            inPlugin.neededDependencies = inPlugin.dependencies;
            inPlugin.categories = ['lost in translation'];
            inPlugin.excerpt = 'Lost excerpt because installed...';
            inPlugin.installed = true;
            inPlugin.maintainer = 'Dr Hardcode';
            inPlugin.updated = Date.now();
            inPlugin.created = Date.now(); 
            
            plugins.push(inPlugin);

          }
          
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
    
    function drawDate(val){
      return moment(val).format('l');
    }
    function drawAgo(val){
      return moment(val).fromNow();
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
      groups:['neededDependencies','categories','hasUpdate','installed'],
      cols:[
            {
              name:'ID',
              id:'id',
              path:'name',
              className:'hidden'
            },
            {
              name:'Plugin title',
              id:'title',
              path:'title'
            },{
              name:'Description',
              id:'excerpt',
              path:'excerpt'
            },{
              name:'Categories',
              id:'categories',
              path:'categories',
              className:'hidden'
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
              name:'Maintainer',
              id:'maintainer',
              path:'maintainer'
            },/*{
              name:'URL',
              id:'url',
              path:'url'
            },*/{
              name:'Dependencies',
              id:'neededDependencies',
              path:'neededDependencies',
              renderer:drawDependencies,
              sorter:sortDependencies,
              className:'hidden'
            },{
              name:'Version',
              id:'version',
              path:'version'
            },{
              name:'Installed',
              id:'installed',
              path:'installed'
                
            },{
              name:'Updates',
              id:'hasUpdate',
              path:'hasUpdate'
                
            }

            /*
        {
          name:'Other images',
          id:'images',
          path:'parents',
          renderer:drawImages,
          width:'20%',
          className:'docker-images',
          hasEvents:true
        }*/
      ]/*,
      topHeader:[
        {
          name:'Container status',
          span:5
        },
        {
          name:'Base image details',
          span:3
        }
      ],
      rowStateClass:function(row,cols,data){
        return (row.getValue('state'))?'state-running':'state-exited';
      }*/
  }

    var $table = $('<div />').appendTo('#main-panel-content-inner');
    
    getPlugins().then(function(plugins){
      var myTable = new SortableTable(tableModel,plugins,$table);
    });
    
    function getPlguinManager(){
      return $.get(resURL + '/pluginManager/api/json?depth=2');
    }
    
    function containerSuccess(data,result,xhr){
      if(typeof data === 'string') data = {records:eval(data)};
      var myTable = new SortableTable(tableModel,data.records,$table);
      //debugger;
     var foo= myTable.getDataMappedAsRows();
      //drawTable(data.records,tableModel,$table);

    }
    
  });

})(jq2_1_3);