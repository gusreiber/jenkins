 (function($){   
    var SortableTable = function(config,data,$target){
      this.config = config || {};
      this.data = data || [];
      this.defaultWrapperClass =  "table table-striped grid";
      this.$target = $target || $('<div class="table-group"><table class="'+this.defaultWrapperClass+'"><colgroup></colgroup><thead></thead></table></div>');
      this.cols = config.cols;
      this.groups = config.groups; // an array of objects that define the grouping menu...
      this.sorts = config.sorts; // an array of objects that define the sorting menu...
      this.rows = [];
      this.topHeader = config.topHeader || {name:config.title};
      this.cellKeyList = [];
      this.rowSateClass = config.rowStateClass || function(row,cols,data){ return 'rowClass';};
      this.sortByVal = null;
      this.sortByValDefault = 'title';
      this.sortLastRev = true;
      this.groupByVal = null;
      this.groupByValDefault = null;
      this.display = config.display ||'table';
      this.groupRenderer = config.groupRenderer;
      this.detailRenderer = config.detailRenderer;
      this.selectAction = config.selectAction;
      this.forceGroup = config.forceGroup;
      this.toolbarTarget = config.toolbarTarget;
      this.resizeAction = config.resizeAction;
      this.finishAction = config.finishAction;
      this.drawTable(this.data,this.config,this.$target);
    };
    
    SortableTable.prototype = {
        
        getCol:function(id){
          return this.cols[this.cellKeyList.indexOf(id)];
        },
        getValue:function(cellId,row){
          var value;
          var keys = this.cellKeyList;
          //If data is already structured...
          if($.isArray(keys) && keys.length > 0){
            value = row.cells[this.cellKeyList.indexOf(cellId)].value;
          }
          //If data is yet unstructured...
          else{
            this.cellKeyList = [];
            $.each(row.cells,function(i,cell){
              this.cellKeyList.push(cell.id);
              if(cellId === cell.id) value = cell.id;
            });
          }
          return value;
        },
        
        filterBy:function(filterString,Grid){
          function searchObject(obj,match){
            for (var prop in obj){
              if (typeof prop === 'string') {
                if(getInnerText(prop).indexOf(fs) > -1){
                  delete row.filtered; 
                  break;
                }                                           
                else
                  row.filtered = true;
              }
              else if (typeof prop === 'object')
                searchObject(prop,match);
            }
          }
          
          function getInnerText(string){
            try{
            var reg = new RegExp('<[a-z][\s\S]*>');
            var newString = (/<[a-z][\s\S]*>/i.test(string))?
                $(string).text().toLowerCase():
                  string.toLowerCase();
            return newString;
            }catch(e){
             // console.log(e);
              return '';
            }
          };

          var fs = filterString.toLowerCase();
          var rows = Grid.rows;
          if(rows.length === 0) rows = Grid.getDataMappedAsRows(Grid.data).rows;
          
          for (var i = 0, length = rows.length; i < length; i++) {
            var row = rows[i];
            var cells = row.cells;
            for (var j = 0, clength = cells.length; j < clength; j++) {
              var cell = cells[j];
              var value = (cell)?cell.value:'zzz-na';
              var sortValue = (cell)?cell.sortValue:'zzz-na';
              if(typeof value === 'boolean' && value){
                if(getInnerText(cell.id).indexOf(fs) > -1 || getInnerText(cell.name).indexOf(fs) > -1){
                  delete row.filtered;               
                  break;
                }
                else
                  row.filtered = true;                  
              }
              if(typeof value === 'string'){
                if(getInnerText(value).indexOf(fs) > -1){
                  delete row.filtered;               
                  break;
                }
                else
                  row.filtered = true;
              }
              if(typeof sortValue === 'string'){
                if(getInnerText(sortValue).indexOf(fs) > -1){
                  delete row.filtered;
                  break;
                }
                else
                  row.filtered = true;
                  
              }
              if(typeof value === 'object')
                searchObject(value,fs);
            }
          }
          Grid.drawRows(rows);
          return false;          
        },
        
        //TODO: This sucks. wtf was I thinking.
        // this flexible signature bullshit is bullshit.
        // also, groupBy and sortBy need to be split.
        sortBy:function(tmpCriteria, tmpGroup, tmpReverse, tmpSortFunc, tmpData){ //all but the criteria are optional....
          var thisObj = this;
          var rows = this.rows;
          var keys = this.cellKeyList;
          
          // Set the sort criteria for the sorting, it will be a string that matches a column id, but will default to last set or global default...
          var criteria = (typeof tmpCriteria === 'string' && keys.indexOf(tmpCriteria) > -1)?
              tmpCriteria:
                ($.isFunction(tmpCriteria))?
                    tmpCriteria():
                      this.sortByValDefault;
          // Set the grouping parameters, if there should be any and default correctly to column ID string or null...
          var group = (typeof tmpGroup === 'string' && keys.indexOf(tmpGroup) > -1)?
              tmpGroup:
                ($.isPlainObject(tmpGroup) && typeof tmpGroup.id === 'string')?
                    tmpGroup:
                      ($.isPlainObject(tmpGroup))? 
                          this.groupByValDefault:
                            this.groupByVal;
          // Should the sorting go forward or back...
          var reverse = (typeof tmpGroup === 'boolean')?
              tmpGroup:
                (typeof tmpReverse === 'boolean')?
                    tmpReverse:
                      !this.sortLastRev;
          
          this.sortLastRev = reverse;
          // Is there a special function by which to sort the columns, or default...
          var sortFunc = ($.isFunction(tmpGroup))?
              tmpGroup:
                ($.isFunction(tmpReverse))?
                tmpReverse:
                  ($.isFunction(tmpSortFunc))?
                    tmpSortFunc:
                      tmpData || function(a,b){
                        a_id = a.cells[keys.indexOf(criteria)].sortValue;
                        b_id = b.cells[keys.indexOf(criteria)].sortValue;
                        if(moment(a_id).isValid() &&  moment(b_id).isValid()){
                          a_id = moment(a_id).valueOf();
                          b_id = moment(b_id).valueOf();
                        }
                        return (reverse)? 
                            (a_id > b_id ? -1 : a_id < b_id ? 1 : 0) : 
                              (a_id > b_id ? 1 : a_id < b_id ? -1 : 0) ;
                      };
          // Is there a new dataset to display, or should the table default to sorting or grouping its last dataset...
          var data = ($.isArray(tmpGroup))?
              tmpGroup:
                ($.isArray(tmpReverse))?
                  tmpReverse:
                    ($.isArray(tmpSortFunc))?
                      tmpSortFunc:
                        tmpData || rows;
          
          // TODO: clearly here is why this all sucks
          // if rows are still empty, reprocess the data into rows....
          if(data.length === 0)
            data = this.getDataMappedAsRows(this.data).rows;
          
          // newRows is the freshly sorted data set...
          var newRows = ($.isArray(data))?data.sort(sortFunc):data;
          
          function buildGroups(latestRows){

            var hasGroupingArray = false;
            var arryGroupRows = [];
            
            // If there is a grouping config object, then we will want to group the items according to its properties...
            var newGroups = {group:group,data:{}};
            
            latestRows = latestRows || newRows;
            var dupChecker = [];
            
            
            $.each(latestRows,function(i,row){
              var newRow = $.extend({},row);
              var rowCells = newRow.cells;
              var rowId = rowCells[0].value; //TODO: this is a hack, I need to let the config set the row key...
              var key = keys.indexOf(group.id);
              var thisCell = rowCells[key]
              var sortValue = thisCell.sortValue;
              var groupItem = ($.isFunction(group.groupFn))?
                  // If there is a grouping function, pass it the cell and row and let it return the correct string...
                  group.groupFn(thisCell,row):
                    // if the sortValue is a JQuery object, grab its outer HTML...
                    (sortValue && sortValue.prop)?
                        sortValue.prop('outerHTML'):
                            sortValue;
                          
                // if the groupItem is an array, 
              // split the row into multiple items for each group item within and get ready to start over...                
              if($.isArray(groupItem)){                  
                newGroups = {group:group,data:{}};
                hasGroupingArray = true;
                $.each(groupItem,function(i,gi){                    
                  newRow.cells[keys.indexOf(group.id)].sortValue = gi;
                  arryGroupRows.push(newRow);                  
                });                  
              }
              
              else{
                arryGroupRows.push(newRow);
                if(!newGroups.data[groupItem]){
                  if(dupChecker.indexOf(rowId) < 0){
                    dupChecker.push(rowId);
                    newGroups.data[groupItem] = [row];                  
                  }
                }
                else{                     
                  if(dupChecker.indexOf(rowId) < 0){
                    dupChecker.push(rowId);
                    newGroups.data[groupItem].push(newRow); 
                  }                    
                }
              }
            });
            
           if(hasGroupingArray)
              buildGroups(arryGroupRows);
           else
              thisObj.drawRows(newGroups);
              
          } 

            
          if(group){
            var t0 = performance.now();
            buildGroups(data);
            var t1 = performance.now();
            console.log("Call to buildGroups took " + (t1 - t0) + " milliseconds.")
          }
          else{
            var t0 = performance.now();
            this.drawRows(newRows);
            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
          }
          this.sortByVal = criteria;
          this.groupByVal = group;
          if(this.$target.find('thead').length === 0 && this.display === 'table')
            this.drawHeaders();          
          return this.rows;
        },
        
        renderGroupAs:function(groupCol,rows,target){
          var value = this.getValue(groupCol.id,rows[0]);
          var display = this.display;
          var groupHtml = (typeof value === 'string')? value: value.title;
          
          var body = '<div/>';
          var row = body;
          var cell = body;
          if(this.display === 'table'){
            body = '<tbody/>';
            row = '<tr/>';
            cell = '<td/>';
          }
          
          if($.isFunction(this.groupRenderer)){
            groupHtml = $(this.groupRenderer(value,rows));            
          }

          var $groupHeader = $(body).addClass('tbody group-header section-tab clearfix ' + value.id).attr('id','grid-group-header-' + value.id);
          var $groupHeaderTr = $(row).addClass('group-row sectoion-divider').appendTo($groupHeader);
          var $groupHeaderTd = $(cell).attr('colspan',rows[0].cells.length).html(groupHtml).appendTo($groupHeaderTr);
          
          return $groupHeader;
        },
        
        renderTableAs:function(target){
          target.addClass('grid-box');
          var $table = target.children('.grid');
          var tag = (this.display === 'table')?'<table/>':'<div/>';
          
          if($table.length === 0) 
            $table =  $(tag).addClass(this.defaultWrapperClass).appendTo(target);
          
          var $toolbarTarget = false;
          if(this.toolbarTarget)  $toolbarTarget = $(this.toolbarTarget);
          
          if(!$toolbarTarget){
            if(target.children('.toolbar-box').length === 0)
              target.prepend(this.drawTools());
          }
          else if ($toolbarTarget.children('.toolbar-box').length === 0){
              $toolbarTarget.prepend(this.drawTools());
          }
          
          
          
          $table.children('.tbody').remove();
          
          return $table;
        },
        
        renderBodyAs:function(target){
          var tag = (target.prop('tagName') === 'TABLE')? '<tbody/>':'<div class="tbody section-boxs" />';
          return $(tag).addClass('tbody box smart-grid no-table clearfix').appendTo(target);  
        },
        
        renderRowAs:function(rowData){
          var tag = '<div class="grid-item">'
          if(this.display === 'table')
            tag = '<tr  class="grid-item" />';
          else if(this.display === 'tiles')
            tag = '<ul class="tile grid-item">';
          
          return $(tag).addClass(rowData.className);
        },
        
        renderCellAs:function(cellData){
          var tag = '<div/>';
          if(this.display === 'table')
            tag = '<td />';
          else if(this.display === 'tiles')
            tag = '<li />';
          var $innerDom = cellData.domValue;
          var $dom = $(tag)
            .addClass(cellData.className)
            .addClass(cellData.id)
            .attr('data-cell-value',cellData.value)
            .append($innerDom);                        
          return $dom;
        },
        
        drawRows:function(rows,cols,$tableBox){
          
          rows = rows || this.rows;
          cols = cols || this.cols;
          var thisObj = this;
          
          $tableBox = $tableBox || this.$target;
          var $table = this.renderTableAs($tableBox);
          var $tbody = this.renderBodyAs($table);
          
          function drawRow(i,row){
            if(row.filtered) return;
            var $tr = thisObj.renderRowAs(row);//.appendTo($tbody);
            $.each(row.cells,function(i,cell){
              var $innerDom = (cell.hasEvents)?
                  cell.renderer(cell.value,row,thisObj):
                    cell.domValue;
              var $cellDom =  thisObj.renderCellAs(cell);
              $tr.append($cellDom);
            });
            $tbody.append($tr);
            if($tr.prop('tagName') !== 'TR')
              $('<div class="slct-box"/>').appendTo($tr).click(
                  function(e){
                    e.stopPropagation();
                    if($.isFunction(thisObj.selectAction)) 
                      thisObj.selectAction(e,row);
                  });
            if($.isFunction(thisObj.detailRenderer))
              $tr.click(function(event){
                thisObj.detailRenderer(event,row,thisObj.data);
              });
              
          }
          
          function drawGroupsAndRows(){
            $tbody.remove();
            var groupObj = rows.group;
            var dataset = rows.data;
            var forceGroup = thisObj.forceGroup;
            var rowsToIterate = (forceGroup)?forceGroup.options:dataset;
            
            $.each(rowsToIterate,function(key,segment){
              
              if(forceGroup) segment = dataset[segment];
              
              var $groupHeader = thisObj.renderGroupAs(groupObj,segment,$table).appendTo($table);
              $tbody = $('<'+ $groupHeader.prop('tagName') +'/>').addClass('tbody group smart-grid clearfix').insertAfter($groupHeader);

              $groupHeader.click(function(e){
                  if(e.target.nodeName === 'A') return true;
                  var $this = $(this).toggleClass('closed');
                  var $group = $this.next('.group');
                  if($this.hasClass('closed'))
                    $group.hide();
                  else 
                    $group.show();
                });
              $.each(segment,drawRow); 
            });
            
            if(thisObj.resizeAction) thisObj.resizeAction();
            
          }
          
          if($.isPlainObject(rows) && $.isPlainObject(rows.data) && rows.group)
            drawGroupsAndRows();
          else{
            $.each(rows,drawRow);
            this.groupByVal = null; 
          }
          
          if(!this.forceGroup) this.finishAction();
        },

        getCellData:function(pathArray,row){
          row = row || this.row;
          var valueSoFar = $.extend({},row);
          for(var i=0; typeof valueSoFar === 'object' && valueSoFar !== null && i< pathArray.length; i++){
            valueSoFar = valueSoFar[pathArray[i]];
          }
          return valueSoFar;
        },

        getDataMappedAsRows:function(data,cols,config){
          if(cols||config) this.cellKeyList = [];
          data = data || this.data;
          cols = cols || this.cols;
          var tableModel = config || this.config;
          
          var rows = [];
          var thisObj = this;
          var cellDataPath = [];
          var cellKeyList = this.cellKeyList; 
          var rebuildKeyList = cellKeyList.length === 0;
          var getCellData = this.getCellData;
          
          $.each(cols,function(i,col){
            var thisCellData = (col.path)? 
                col.path.split('.') :
                  [];
            cellDataPath.push(thisCellData);
            if(rebuildKeyList) cellKeyList.push(col.id);
          });
          
          this.cellKeyList = cellKeyList;
          
          $.each(data,function(i,row){ 
            var dRow = {cells:[]};
            row.getValue = dRow.getValue = function(cellId){
              //If data is already structured...
              if($.isArray(this.cells))
                this.cells[cellKeyList.indexOf(cellId)].value;
              //If data is yet unstructured...
              else
                return thisObj.getCellData(cellDataPath[cellKeyList.indexOf(cellId)],this);
            };
            
            $.each(cols,function(i,col){
              var dCell = $.extend({},col);
              dCell.value = getCellData(cellDataPath[cellKeyList.indexOf(col.id)],row);
              dCell.domValue = ($.isFunction(col.renderer))?
                  col.renderer(dCell.value,row,thisObj):
                    dCell.value;

              dCell.sortValue = ($.isFunction(col.sorter))?
                  col.sorter(dCell.value,row,thisObj):
                    (typeof dCell.value === 'string')?
                        dCell.value:
                          (dCell.value && dCell.value.id)?
                              dCell.value.id:
                                dCell.domValue;
              dRow.cells.push(dCell);
            });

            if(tableModel.rowStateClass) dRow.className = tableModel.rowStateClass(dRow,cols,row,data);
            rows.push(dRow);
          });
          return {rows:rows,cols:cols,config:config};
          
        },        
        
        drawTools:function(data,tableModel,$tableBox){
          var thisObj = this;
          if($('#hover-space').length < 1) $('body').append('<div id="hover-space" class="bootstrap3" />');

          var grouper = '';
          var sorter = '';
          
          function optionRenderer(options,includeAttr){
            includeAttr = includeAttr || 'sortable';
            var optionsHtml = [];
            $.each(options,function(i,opt){
              if(!opt[includeAttr]) return;
              var o = (typeof opt === 'string')?{id:opt}:opt;
              var oHtml = ['<li data-effect="',o.id,'"><a class="btn-sm ',o.id,'" href="#',o.id,'">',o.name || o.id,'</a></li>'].join('');
              optionsHtml.push(oHtml);
            });
            return optionsHtml.join('');
          }
          
          function pullDownWrapper(name,title,options){
            return [
              '<li class="dropdown" data-action="',name,'">',
              '<a href="#" class="dropdown btn-sm" data-toggle="dropdown" role="button" aria-expanded="false">',title,' by <span class="caret"></span></a>',
              '<ul class="dropdown-menu" role="menu">',
                '<li data-effect="none"><a class="btn-sm" href="#none">None</a></li>',
                optionRenderer(options),
               '</ul>',
              '</li>'       
               ].join('');
          }
          
          if($.isArray(thisObj.groups) && !this.forceGroup)            
            grouper = pullDownWrapper('group','Group',thisObj.groups);
          
          if($.isArray(thisObj.cols) && thisObj.cols.length > 1)            
            sorter = pullDownWrapper('sort','Sort',thisObj.cols);
          
          var $toolBox = $(['<div class="toolbar-box"><div class="toolbar">',
            '<div class="hidden table-hovers"></div>',
            '<nav class="navbar navbar-default navbar-condensed nav-condensed attached" ><div class="container-fluid">',
              '<form class="nav navbar-form navbar-left">',
                '<fieldset class="form-group">',
                  '<div class="input-group input-group-sm">',
                    '<input type="text" class="form-control input-sm" placeholder="Find plugins...">',
                    '<span class="input-group-btn"><button class="btn btn-default" type="button">Go!</button></span>',
                  '</div>',
                '</fieldset>',
              '</form>',
              '<ul class="nav navbar-nav navbar-right">',
                sorter,
                grouper,
               '</ul>',
            '</div></nav></div></div>'].join(''));//.prependTo($tableBox);
          
          $toolBox.find('form').submit(function(e){e.preventDefault()});
          
          $toolBox.find('.input-group input.form-control').change(function(e){
            // here I am....
            e.preventDefault();

            var searchString = $(this).val().toLowerCase();
            
            return thisObj.filterBy(searchString,thisObj);
            
          });
          
          $toolBox.find('li[data-action="group"] li > a').click('group',function(e){
            e.preventDefault();
            var $this = $(this);
            var id = $this.attr('href').replace('#','');
            thisObj.sortBy(id,thisObj.getCol(id));            
          });
          
          $toolBox.find('li[data-action="sort"] li > a').click('group',function(e){
            e.preventDefault();
            var $this = $(this);
            var id = $this.attr('href').replace('#','');
            thisObj.sortBy(id);            
          });
          
          
          return $toolBox;
        },
        drawHeaders: function(data,tableModel,$tableBox){
          var thisObj = this;
          var cellDataPath = [];
          var cellKeyList = this.cellKeyList;
          var rebuildKeyList = cellKeyList.length === 0;
          
          if(tableModel) this.cellKeyList = [];
          data = data || this.data;
          tableModel = tableModel || this.config;
          $tableBox = $tableBox || this.$target;  
          
          var $table = $tableBox.find('table');
          if($table.length === 0)
            this.renderTableAs($tableBox);
          
          var $colgroup = ($table.children('colgroup').length > 0 && display === 'table')?
              $table.find('colgroup'):
                $('<colgroup />').prependTo($table);
          
          var $thead = $table.find('thead').empty()
          if($thead.length ===0) 
            $thead = $('<thead/>').appendTo($table);
          
          $thead = $('<tr/>').appendTo($thead);
          var cols = tableModel.cols || this.cols;          
          
          // draw the headers and setup cell drawing...      
          $.each(cols,function(i,col){
            var thisCellData = (col.path)? 
                col.path.split('.') :
                  [];
            if(!col.hidden){
              $th = $('<th/>').attr('data-col-id',col.id).addClass(col.className).append('<a/>').attr('href',('#sortby='+col.id)).text(col.name).appendTo($thead);
              $col = $('<col/>').width(col.width).addClass(col.className).appendTo($colgroup); 
              cellDataPath.push(thisCellData);
              if(rebuildKeyList) cellKeyList.push(col.id);
              $th.click(function(e){
                e.preventDefault();
                var $this = $(this);
                var id = $this.attr('data-col-id');
                var $parent = $this.parent();
                var $cols = $colgroup.find('col');
                $parent.find('.sorted').removeClass('sorted');
                $cols.removeClass('sorted');
                $($cols[$this.index()]).addClass('sorted');
                $this.addClass('sorted').toggleClass('asc');

                if($this.hasClass('asc'))
                  thisObj.sortBy(id);
                else
                  thisObj.sortBy(id,true);
              });
            }
          });
    
          // draw the top headers, if there are any...
          if($.isArray(tableModel.topHeader) && tableModel.topHeader.length > 0){
            var $topThead = $('<tr class="topHeadTr" />').prependTo($thead.parent());
            var $cols = $colgroup.find('col');
            var colCount = 0;
            $.each(tableModel.topHeader,function(i,th){
              colCount += th.span;
              $topThead.append('<th/>').attr('colspan',th.span);
              $($cols[colCount]).addClass('v-divider');
            });
          }
          this.cellKeyList = cellKeyList;
          return cellDataPath;
        },
        
        drawTable: function(data,tableModel,$tableBox){  
          $(window).resize(this.resizeAction);
          var fg = this.forceGroup;
          if(fg){
            var key = fg.key;
            var newData = this.getDataMappedAsRows(data);
            this.sortBy(key,this.getCol(key),newData.rows);
            this.finishAction();
            return;
          }
          
          if(tableModel) this.cellKeyList = [];
          data = data || this.data;
          tableModel = tableModel || this.tableModel;
          $tableBox = $tableBox || this.$target;
          var $table = this.renderTableAs($tableBox);
          
          var $colgroup = ($table.children('colgroup').length > 0 && display === 'table')?
              $table.find('colgroup'):
                $('<colgroup />').prependTo($table.find('table'));
          
          var $thead = $('<tr/>').appendTo($table.find('thead').empty());
          
          var thisObj = this;
          var cols = tableModel.cols || this.cols;
          var cellDataPath = [];
          var cellKeyList = this.cellKeyList;
          var rebuildKeyList = cellKeyList.length === 0;
          var pData = [];
          
          var getCellData = this.getCellData;
          var sortBy = this.sortBy;
          
          

          function drawBody(){
            // draw rows...
            cellDataPath = this.drawHeaders(data,tableModel,$tableBox);
            
            var $tbody = thisObj.renderBodyAs($table);
            
            var t0 = performance.now();           
            for(var i = 0; i < data.length; i++){
              var row = data[i];
              var dRow = {cells:[]};
              row.getValue = dRow.getValue = function(cellId){
                //If data is already structured...
                if($.isArray(this.cells)){
                  return this.cells[cellKeyList.indexOf(cellId)].value;
                }
                //If data is yet unstructured...
                else
                  return thisObj.getCellData(cellDataPath[cellKeyList.indexOf(cellId)],this);
              };            
              
              var $tr = thisObj.renderRowAs(row).appendTo($tbody);        
              
              for(var j = 0; j< cols.length; j++){
                var col = cols[j];
                var dCell = $.extend({},col);
                dCell.value = getCellData(cellDataPath[cellKeyList.indexOf(col.id)],row);
                dCell.domValue = ($.isFunction(col.renderer))?
                    col.renderer(dCell.value,row,thisObj):
                      dCell.value;

                dCell.sortValue = ($.isFunction(col.sorter))?
                  col.sorter(dCell.value,row,thisObj):
                    (typeof dCell.value === 'string')?
                        dCell.value:
                          (dCell.value && dCell.value.id)?
                              dCell.value.id:
                                dCell.domValue;
                dRow.cells.push(dCell);
                var $dom = thisObj.renderCellAs(dCell);
                $tr.append($dom);
              }
              dRow.className = (tableModel.rowStateClass)? tableModel.rowStateClass(dRow,cols,row,data):'';
              pData.push(dRow);
            }
            var t1 = performance.now();
            console.log("Call to drawBody took " + (t1 - t0) + " milliseconds.");
            
            thisObj.rows = pData;
            return pData;
          }
          this.drawTools(data,tableModel,$tableBox);
          drawBody();
          
          if(this.resizeAction) this.resizeAction();
        }        
    }
    jq2_1_3.SortableTable = SortableTable;
})(jq2_1_3);