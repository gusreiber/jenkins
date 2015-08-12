console.log('hetero-list/index.js');
var jquery = require('jquery-detached-2.1.4');

var tagName = '[data-tagName="hetero-list-item"]'; //what DOM element am I attached to...
var scope = 'form'; //how much of the DOM do I need to watch for changes...

// Attaches events to the DOM elements and decorates them with whatever state specific information might be necessary post server page rendering... 
exports.init = function() {
  var $ = jquery.getJQuery();

  // attaching the main event to the element...
  attachEvents('click',openListEvent,' .hetero-list-add');
  attachEvents('click',selectItemEvent,'> .panel-section-header');
  
  watchDomModification();
  
  addDomDecorations();
  
  return exports;
};



////////////////////////////////
//    Event Handlers
////////////////////////////////

//this function takes both events and JQuery target elements, 
//allowing it to be used as an event handler internally 
//or to be triggered by other elements who may need to inject DOM elements by some other means.
// takes either a DOM element, selector, or event...
exports.resize = function(eventOrElem){
  var $ = jquery.getJQuery();
  // eventOrElem is an event if it has a current target, otherwise an element...
  var $input = (eventOrElem.currentTarget)? $(eventOrElem.currentTarget) : $(eventOrElem);
  var $body  = $input.closest('.panel-collapse').addClass('collapse in').height('auto');
  var orgHeight = $body.height();
  
  return {$elem:$body,event:eventOrElem};
}; 

//This is very similar to the Bootstrap Collapse, 
//but unlike BS Collapse, the panels have no knowledge of the parent elements
function openCloseEventHandler(e){
  var $ = jquery.getJQuery();
  var $header = $(this);
  var $section = $header.closest(tagName);
  var $body  = $section.children('.panel-collapse').addClass('collapse in').height('auto');
  var orgHeight = $body.height(); 
  
  e.preventDefault(); 
  
  if(!$section.hasClass('not-shown')){
   $body.removeAttr('style');
   orgHeight = $body.height();
   $body.height(orgHeight);
   $section.removeClass('shown').addClass('not-shown');
   $body.height(0);
  }
  else{
   $section.addClass('shown').removeClass('not-shown');
   $body.height(orgHeight);
  }
  
  return {$elem:$section,event:e};
}



////////////////////////////////
//    Helper functions
////////////////////////////////

// Attaches events by wrapping the JQ 'on' function 
// to give it a clearer name and signature...
function attachEvents(event, eventHandler, target, targetScope ){
  var $ = jquery.getJQuery();
  targetScope = targetScope || ' > .panel-collapse ';
  target = target || '';
  // This 'on' syntax is from JQuery: http://api.jquery.com/on/
  // scope allows for a sub portion of the document to be watched for matching event selectors
  $(scope).on(event,tagName + targetScope + target ,eventHandler);
}

// Watches the DOM for modification by wrapping the JQ 'DOMNodeInserted' event trigger...
function watchDomModification(){
  var $ = jquery.getJQuery();  
  $(scope).on('DOMNodeInserted', addDomDecorations);
}

// Finds all the elements and does whatever state decoration might be necessary post server rendering...
function addDomDecorations(){
  var $ = jquery.getJQuery();
  var $elems = $(tagName)
    .each(function(i,section){
      var $section = $(section);
      var $body  = $section.children('.panel-collapse').addClass('collapse in');
      
      exports.resize($body);
      
      // color code child nested nodes so that they box up correctly when nested...
      $body.find('.setting-main').each(function(i){
        var $main = $(this);
        var $repeated = $main.children('.repeated-container');
        if($repeated && $repeated.length > 0)
          $main.addClass('fill');
      });

    });      
  
  return $elems;
}