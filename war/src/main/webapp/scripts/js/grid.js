 (function($){   
    var SortableTable = function(config,data,$target){
      this.config = config || {};
      this.data = data || [];
      this.$target = $target || $('<div class="table-group"><table class="table table-striped grid"><colgroup></colgroup><thead></thead><tbody></tbody></table></div>');
      this.cols = config.cols;
      this.groups = config.groups; // an array of objects that define the grouping menu...
      this.sorts = config.sorts; // an array of objects that define the sorting menu...
      this.rows = [];
      this.topHeader = config.topHeader || {name:config.title};
      this.cellKeyList = [];
      this.rowSateClass = config.rowStateClass || function(row,cols,data){ return 'rowClass';};
      this.sortByVal = null;
      this.sortByValDefault = 'name';
      this.groupByVal = null;
      this.groupByValDefault = null;
      this.helpers = {
          groupByDate:function(cell,row,b,c){
            if(!cell.value.startedAt) 
              return null;
            var thisDate = (cell.value.running)?
              moment(cell.value.startedAt):
                moment(cell.value.finishedAt);
            var now = moment(new Date());
            var today = moment(new Date()).subtract(1,'day');
            var yesterday = moment(new Date()).subtract(2,'day');
            var thisWeek = moment(new Date()).subtract(1,'week');
            var thisMonth = moment(new Date()).subtract(1,'month');
            var recently = (thisDate.isBetween(today,now))?
                'Today':
                  (thisDate.isBetween(yesterday,today))?
                      'Yesterday':
                        (thisDate.isBetween(thisWeek,yesterday))?
                            'This week':
                              (thisDate.isBetween(thisMonth,thisWeek))?
                                  'This month':
                                    'Long ago';
            return recently;
          }
        };
      this.drawTable(this.data,this.config,this.$target);
    };
    
    SortableTable.prototype = {
        getCol:function(id){
          return this.cols[this.cellKeyList.indexOf(id)];
        },
        getValue:function(i,row){
          row = row || this;
        //If data is already structured...
          if($.isArray(this.cells)){
            this.cells[cellKeyList.indexOf(cellId)].value;
          }
          //If data is yet unstructured...
          else
            return thisObj.getCellData(cellDataPath[cellKeyList.indexOf(cellId)],this);          
        },
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
                      false;
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
          
          // newRows is the freshly sorted data set...
          var newRows = ($.isArray(data))?data.sort(sortFunc):data;
          var arryGroupRows = [];

          
          // If there is a grouping config object, then we will want to group the items according to its properties...
          var newGroups = {group:group,data:{}};
          if(group){
            function buildGroups(latestRows){
              var hasGroupingArray = false;
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
                function transformArray(i,gi){                  
                  newRow.cells[keys.indexOf(group.id)].sortValue = gi;
                  arryGroupRows.push(newRow);                  
                }

                // if the groupItem is an array, 
                // split the row into multiple items for each group item within and get ready to start over...                
                if($.isArray(groupItem)){                  
                  newGroups = {group:group,data:{}};
                  hasGroupingArray = true;
                  $.each(groupItem,transformArray);                  
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
            var t0 = performance.now();
            buildGroups();
            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
          }
          else{
            var t0 = performance.now();
            this.drawRows(newRows);
            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
          }
          this.sortByVal = criteria;
          this.groupByVal = group;
          return this.rows;
        },
        
        renderGroupAs:function(groupData,key,target,type){
          type = '<tbody/>'
          var $groupHeader = $(type).addClass('group-header').appendTo(target);
          var $body = $(type).addClass('group ').insertAfter($groupHeader);
          var $groupHeaderTr = $('<tr/>').addClass('group-row').appendTo($groupHeader);
          var $groupHeaderTd = $('<td/>').attr('colspan',groupData[0].cells.length).text(key).appendTo($groupHeaderTr);
          return $groupHeader
        },
        
        renderBodyAs:function(target,type){
          type = type || '<div/>';
          var tagname = type.substring(1,type.length-2);
          target.find(tagname).remove();
          if(type === '<tbody/>')
            return $(type).addClass('box smart-grid no-table').appendTo(target);  
          else
            return $('<td/>').addClass('box smart-grid no-table').appendTo(
                ($('<tr/>').appendTo('<tbody/>')).appendTo(target));
        },
        
        renderRowAs:function(rowData,type){
          type = type || '<ul/>';
          return $(type).addClass(rowData.className).addClass('tile');
        },
        
        renderCellAs:function(cellData,type){
          type = type || '<li/>';
          var $innerDom = cellData.domValue;
          var $dom = $(type)
            .addClass(cellData.className)
            .addClass(cellData.id)
            .attr('data-cell-value',cellData.value)
            .append($innerDom);                        
          return $dom;
        },
        
        drawRows:function(rows,cols,$tableBox){
          rows = rows || this.rows;
          cols = cols || this.cols;
          
          $tableBox = $tableBox || this.$target;
          var $table = $tableBox.children('table');

          var $tbody = this.renderBodyAs($table);
          
          var thisObj = this;
          var drawRow = function(i,row){
            if(row.filtered) return;
            var $tr = thisObj.renderRowAs(row).appendTo($tbody);
            $.each(row.cells,function(i,cell){
              var $innerDom = (cell.hasEvents)?
                  cell.renderer(cell.value,row,thisObj):
                    cell.domValue;
              var $cellDom =  thisObj.renderCellAs(cell);
              $tr.append($cellDom);
            });            
          };
          if($.isPlainObject(rows) && $.isPlainObject(rows.data) && rows.group){
            debugger;
            var noTable = $tbody.is('.no-table');
            $tbody.remove();
            var groupObj = rows.group;
            $.each(rows.data,function(key,segment){
              var $groupHeader = thisObj.renderGroupAs(segment,key,$table,'<tbody/>')
              $tbody = $groupHeader.next();
              if(noTable) $tbody = $('<td/>').addClass('no-table').appendTo($('<tr/>').appendTo($tbody));
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
          }
          else
            $.each(rows,drawRow);          
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
            dRow.className = tableModel.rowStateClass(row,cols,data);
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
                          dCell.domValue;
              dRow.cells.push(dCell);
            });
            rows.push(dRow);
          });
          return {rows:rows,cols:cols,config:config};
          
        },        
        
        setRows:function(data,cols,config){
           
        },
        
        drawTable: function(data,tableModel,$tableBox){
          if(tableModel) this.cellKeyList = [];
          data = data || this.data;
          tableModel = tableModel || this.tableModel;
          $tableBox = $tableBox || this.$target;
          
          var $table = ($tableBox.children('table').length > 0)?
              $tableBox.children('table'):
                $('<table class="table table-striped grid"><colgroup></colgroup><thead></thead><tbody></tbody></table>').appendTo($tableBox);
          var $colgroup = ($table.find('colgroup').length > 0)?
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
          
          function drawTools(){
            if($('#hover-space').length < 1) $('body').append('<div id="hover-space" class="bootstrap3" />');

            var grouper = '';
            if($.isArray(thisObj.groups)){
              var grouperHtml = [];
              $.each(thisObj.groups,function(i,groupItem){
                var g = (typeof groupItem === 'string')?{id:groupItem}:groupItem;
                var groupHtml = ['<li data-effect="',g.id,'"><a class="btn-sm ',g.id,'" href="#',g.id,'">',g.name || g.id,'</a></li>'].join('');
                grouperHtml.push(groupHtml);
              });

              grouper = ['<li class="dropdown" data-action="group">',
               '<a href="#" class="dropdown btn-sm" data-toggle="dropdown" role="button" aria-expanded="false">Group by <span class="caret"></span></a>',
               '<ul class="dropdown-menu" role="menu">',
                 '<li data-effect="none"><a class="btn-sm" href="#none">None</a></li>',
                 grouperHtml.join(''),
                '</ul>',
              '</li>',].join('');
              
            }
            
            var $toolBox = $([
              '<div class="hidden table-hovers"></div>',
              '<nav class="navbar navbar-default navbar-condensed nav-condensed attached" ><div class="container-fluid">',
                '<form class="nav navbar-form navbar-left">',
                  '<fieldset class="form-group">',
                    '<div class="input-group input-group-sm">',
                      '<input type="text" class="form-control input-sm" placeholder="Filter containers...">',
                      '<span class="input-group-btn"><button class="btn btn-default" type="button">Go!</button></span>',
                    '</div>',
                  '</fieldset>',
                '</form>',
                '<ul class="nav navbar-nav navbar-right">',
                  '<li class="dropdown" data-action="sort">',
                    '<a href="#" class="dropdown btn-sm" data-toggle="dropdown" role="button" aria-expanded="false">Sort by <span class="caret"></span></a>',
                    '<ul class="dropdown-menu" role="menu">',
                      '<li><a class="btn-sm" href="#">Item type</a></li>',
                      '<li><a class="btn-sm" href="#">Environment</a></li>',
                      '<li><a class="btn-sm" href="#">Updated</a></li>',
                      '<li><a class="btn-sm" href="#">Health</a></li>',
                      '<li><a class="btn-sm" href="#">Status</a></li>',
                    '</ul>',
                  '</li>',
                  grouper,
                 '</ul>',
              '</div></nav>'].join('')).prependTo($tableBox);
            
            $toolBox.find('.input-group input.form-control').change(thisObj,function(e){
              e.preventDefault();
              var searchObject = function(obj,match){
                for (var prop in obj){
                  if (typeof prop === 'string') {
                    if(getInnerText(prop).indexOf(searchString) > -1){
                      delete row.filtered; 
                      break;
                    }                                           
                    else
                      row.filtered = true;
                  }
                  else if (typeof prop === 'object')
                    searchObject(prop,match);
                }
              };
              var getInnerText = function(string){
                var reg = new RegExp('<[a-z][\s\S]*>');
                var newString = (/<[a-z][\s\S]*>/i.test(string))?
                    $(string).text().toLowerCase():
                      string.toLowerCase();
                return newString;
              };
              var $input = $(this);
              var searchString = $input.val().toLowerCase();
              var rows = e.data.rows;
              for (var i = 0, length = rows.length; i < length; i++) {
                var row = rows[i];
                var cells = row.cells;
                for (var j = 0, clength = cells.length; j < clength; j++) {
                  var cell = cells[j];
                  var value = (cell)?cell.value:'zzz-na';
                  var sortValue = (cell)?cell.sortValue:'zzz-na';
                  if(typeof value === 'string'){
                    if(getInnerText(value).indexOf(searchString) > -1){
                      delete row.filtered;               
                      break;
                    }
                    else
                      row.filtered = true;
                  }
                  if(typeof sortValue === 'string'){
                    if(getInnerText(sortValue).indexOf(searchString) > -1){
                      delete row.filtered;
                      break;
                    }
                    else
                      row.filtered = true;
                      
                  }
                  if(typeof value === 'object')
                    searchObject(value,searchString);
                }
              }
              thisObj.drawRows(rows);
             
            });
            
            $toolBox.find('li[data-action="group"] li > a').click('group',function(e){
              e.preventDefault();
              var $this = $(this);
              var id = $this.attr('href').replace('#','');
              var groupObj = {display:'renderer'};
              if (thisObj.helpers[$this.attr('data-group-fn')])
                groupObj.groupFn = thisObj.helpers[$this.attr('data-group-fn')];
                    
              thisObj.sortBy(id,$.extend(groupObj,thisObj.getCol(id)));
              
            });
            
          }
          
          function drawHeaders(){
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
          }

          function drawBody(){
            // draw rows...
            drawHeaders();
            var $tbody = thisObj.renderBodyAs($table);
            
            var t0 = performance.now();           
            for(var i = 0; i < data.length; i++){
              var row = data[i];
              var dRow = {cells:[]};
              row.getValue = dRow.getValue = function(cellId){
                //If data is already structured...
                if($.isArray(this.cells)){
                  this.cells[cellKeyList.indexOf(cellId)].value;
                }
                //If data is yet unstructured...
                else
                  return thisObj.getCellData(cellDataPath[cellKeyList.indexOf(cellId)],this);
              };
                            
              dRow.className = (tableModel.rowStateClass)? tableModel.rowStateClass(row,cols,data):'';
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
                          dCell.domValue;
                dRow.cells.push(dCell);
                var $dom = thisObj.renderCellAs(dCell);
                $tr.append($dom);
              }
              pData.push(dRow);
            }
            var t1 = performance.now();
            console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
            
            thisObj.rows = pData;
            return pData;
          }
          drawTools();
          drawBody();
          
        }        
    }
    jq2_1_3.SortableTable = SortableTable;
})(jq2_1_3);