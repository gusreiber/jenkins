var jquery = require('jquery-detached-2.1.4');

exports.init = function() {
    var $ = jquery.getJQuery();
    
    $('form').each(function() {
        var form = this;
        
        crumb.appendToForm(form);
        if(Element.hasClassName(form, "no-json"))
            return;
        // add the hidden 'json' input field, which receives the form structure in JSON
        $(form).append("<div><input type='hidden' name='json' value='init'></div>");

        var oldOnsubmit = form.onsubmit;
        if (typeof oldOnsubmit == "function") {
            form.onsubmit = function() { return buildFormTree(this) && oldOnsubmit.call(this); }
        } else {
            form.onsubmit = function() { return buildFormTree(this); };
        }
    });
};

//
// structured form submission handling
//   see http://wiki.jenkins-ci.org/display/JENKINS/Structured+Form+Submission
exports.buildFormTree = function(form) {
    try {
        // I initially tried to use an associative array with DOM elements as keys
        // but that doesn't seem to work neither on IE nor Firefox.
        // so I switch back to adding a dynamic property on DOM.
        form.formDom = {}; // root object

        var doms = []; // DOMs that we added 'formDom' for.
        doms.push(form);

        function addProperty(parent,name,value) {
            name = shortenName(name);
            if(parent[name]!=null) {
                if(parent[name].push==null) // is this array?
                    parent[name] = [ parent[name] ];
                parent[name].push(value);
            } else {
                parent[name] = value;
            }
        }

        // find the grouping parent node, which will have @name.
        // then return the corresponding object in the map
        function findParent(e) {            
            var p = exports.findFormParent(e,form);
            if (p==null)    return {};

            var m = p.formDom;
            if(m==null) {
                // this is a new grouping node
                doms.push(p);
                p.formDom = m = {};
                addProperty(findParent(p), p.getAttribute("name"), m);
            }
            return m;
        }

        var jsonElement = null;

        for( var i=0; i<form.elements.length; i++ ) {
            var e = form.elements[i];
            if(e.name=="json") {
                jsonElement = e;
                continue;
            }
            if(e.tagName=="FIELDSET")
                continue;
            if(e.tagName=="SELECT" && e.multiple) {
                var values = [];
                for( var o=0; o<e.options.length; o++ ) {
                    var opt = e.options.item(o);
                    if(opt.selected)
                        values.push(opt.value);
                }
                addProperty(findParent(e),e.name,values);
                continue;
            }
                
            var p;
            var r;
            var type = e.getAttribute("type");
            if(type==null)  type="";
            switch(type.toLowerCase()) {
            case "button":
            case "submit":
                break;
            case "checkbox":
                p = findParent(e);
                var checked = xor(e.checked,Element.hasClassName(e,"negative"));
                if(!e.groupingNode) {
                    v = e.getAttribute("json");
                    if (v) {
                        // if the special attribute is present, we'll either set the value or not. useful for an array of checkboxes
                        // we can't use @value because IE6 sets the value to be "on" if it's left unspecified.
                        if (checked)
                            addProperty(p, e.name, v);
                    } else {// otherwise it'll bind to boolean
                        addProperty(p, e.name, checked);
                    }
                } else {
                    if(checked)
                        addProperty(p, e.name, e.formDom = {});
                }
                break;
            case "file":
                // to support structured form submission with file uploads,
                // rename form field names to unique ones, and leave this name mapping information
                // in JSON. this behavior is backward incompatible, so only do
                // this when
                p = findParent(e);
                if(e.getAttribute("jsonAware")!=null) {
                    var on = e.getAttribute("originalName");
                    if(on!=null) {
                        addProperty(p,on,e.name);
                    } else {
                        var uniqName = "file"+(iota++);
                        addProperty(p,e.name,uniqName);
                        e.setAttribute("originalName",e.name);
                        e.name = uniqName;
                    }
                }
                // switch to multipart/form-data to support file submission
                // @enctype is the standard, but IE needs @encoding.
                form.enctype = form.encoding = "multipart/form-data";
                break;
            case "radio":
                if(!e.checked)  break;
                r=0;
                while (e.name.substring(r,r+8)=='removeme')
                    r = e.name.indexOf('_',r+8)+1;
                p = findParent(e);
                if(e.groupingNode) {
                    addProperty(p, e.name.substring(r), e.formDom = { value: e.value });
                } else {
                    addProperty(p, e.name.substring(r), e.value);
                }
                break;

            default:
                p = findParent(e);
                addProperty(p, e.name, e.value);
                break;
            }
        }

        jsonElement.value = Object.toJSON(form.formDom);

        // clean up
        for( i=0; i<doms.length; i++ )
            doms[i].formDom = null;

        return true;
    } catch(e) {
        alert(e+'\n(form not submitted)');
        return false;
    }
};
// Hack to offer backward compatibility for callers of the 
// global version that used to be defined in hudson-behavior.js
if (typeof window !== 'undefined') {
    window.buildFormTree = function (form) {
        // TODO: some sort of low noise warning
        return exports.buildFormTree(form);
    };
}

/**
 * Finds the DOM node of the given DOM node that acts as a parent in the form submission.
 *
 * @param {HTMLElement} e
 *      The node whose parent we are looking for.
 * @param {HTMLFormElement} form
 *      The form element that owns 'e'. Passed in as a performance improvement. Can be null.
 * @return null
 *      if the given element shouldn't be a part of the final submission.
 */
exports.findFormParent = function(e,form,isStatic) {
    isStatic = isStatic || false;

    if (form==null) // caller can pass in null to have this method compute the owning form
        form = findAncestor(e,"FORM");

    while(e!=form) {
        // this is used to create a group where no single containing parent node exists,
        // like <optionalBlock>
        var nameRef = e.getAttribute("nameRef");
        if(nameRef!=null)
            e = $(nameRef);
        else
            e = e.parentNode;

        if(!isStatic && e.getAttribute("field-disabled")!=null)
            return null;  // this field shouldn't contribute to the final result

        var name = e.getAttribute("name");
        if(name!=null && name.length>0) {
            if(e.tagName=="INPUT" && !isStatic && !xor(e.checked,Element.hasClassName(e,"negative")))
                return null;  // field is not active

            return e;
        }
    }

    return form;
};
// Hack to offer backward compatibility for callers of the 
// global version that used to be defined in hudson-behavior.js 
if (typeof window !== 'undefined') {
    window.findFormParent = function (e,form,isStatic) {
        // TODO: some sort of low noise warning
        return exports.findFormParent(e,form,isStatic);
    };
}

// compute the form field name from the control name
function shortenName(name) {
    // [abc.def.ghi] -> abc.def.ghi
    if(name.startsWith('['))
        return name.substring(1,name.length-1);

    // abc.def.ghi -> ghi
    var idx = name.lastIndexOf('.');
    if(idx>=0)  name = name.substring(idx+1);
    return name;
}