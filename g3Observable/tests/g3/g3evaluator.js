/*********************************Object evaluator******************************
 * A graphical client testing tool for batch processing javascript commands.
 * It uses eval() and emulates console.log() in all clients even in IE browsers.
 * @module {g3}
 * @function {g3.evaluator.getInstance}
 * @public
 * @return {Object} It builds the node tree and assigns events on nodes.
 *
 * @version 0.1.2
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
*******************************************************************************/
(function(g3, $, window, document, undefined){
/*
 * Add necessary functions from 'g3.utils' namespace.
 */
g3.utils = g3.utils || {};
g3.utils.randomString = function(len, charSet){
   charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var result = '', ndx;
   for (var i = 0; i < len; i++){
      ndx = Math.floor(Math.random() * charSet.length);
      result += charSet.substring(ndx, ndx+1);
   }
   return result;
}

g3.evaluator = (function(){   
   var obj;
   /*
    * initialization function:
    * contains event handlers and tree manipulation
    */
   function init(){
      /*
       * 'global' variables
       */
      var nodes = {
         $console: $("form#console pre"), /*see _console*/
         $frameSrc: $("form#loadFrame input[type='text']"), /*see 'load/remove frame button actions'*/
         $excludeNodes: $("form#bodyHtml input[type='text']"), /*see 'load body html button actions'*/
         $name: $('form#addRemoveLib #libName'), /*see 'add/remove library button actions'*/
         $path: $('form#addRemoveLib #libPath'),
         $title: $('form#blackboard input#title'), /*see 'blackboard button actions'*/
         $panel: $('form#addRemovePanel #panelTitle'), /*see 'add/remove panel button actions'*/
         $blackboard: $('#blackboard textarea') /*see 'load to blackboard behaviour'*/
      };
      
      /*
       * generic _console object with log function
       */
      var _console = {
         rerun: false,
         log: function(value, n, force){
            //IE8 returns form with id="console"!
            if(console && console.log)
               console.log(value);
            if(!this.rerun)
               nodes.$console.html('');
            this.rerun = true;
            //if(value && (typeof value === 'object'))
               nodes.$console.html(nodes.$console.html() + g3.debug(value, n, force).toHtml());
            //else
            //   nodes.$console.html(nodes.$console.html() + value + '<br />');
         }
      };
      
      /*
       * evaluation function
       */
      function evalExpr(value){
         var commands;
         var re = /console.log/g;
         value = value.replace(re, '_console.log');
         try{
            eval(value);
         }catch(e){
            alert(e);
         }
      }
      
      /*
       * set/edit title
       */
      document.title = $("#title h1").text();
      $("#title span").click(function(){
         $(this).toggleClass('edit');
         if($(this).hasClass('edit'))
            $(this).siblings('h1').prop('contenteditable', 'true');
         else{
            $(this).siblings('h1').prop('contenteditable', 'false');
            //$('title', document.getElementsByTagName('head')[0]).text($(this).siblings('h1').text());
            document.title = $("#title h1").text();
         }
      });
      
      /*
       * load/remove frame button actions
       */
      $("form#loadFrame legend").click(function(){
         $("form#loadFrame div").slideToggle();
      });
      $("form#loadFrame button, form#loadFrame input[type='button']").click(function(event){
         if($(this).val() === 'Load'){
            obj.loadFrame(nodes.$frameSrc.val());
            //$('<iframe>').addClass('frame').prop('src', nodes.$frameSrc.val()).appendTo('#stub');
         }else if($(this).val() === 'Remove'){
            obj.deleteFrame();
            //$('#stub iframe').remove();
         }
      });
      
      /*
       * load body html button actions
       */
      $("form#bodyHtml legend").click(function(){
         $("form#bodyHtml div").slideToggle();
      });
      $("form#bodyHtml button, form#bodyHtml input[type='button']").click(function(event){
         if($(this).val() === 'Load'){
            var txt = '';
            var excl = nodes.$excludeNodes.val().split(/\s+|\s*,\s*|\s*;\s*|\s*\|\s*/);
            for(var i = 0; i < excl.length; i++){
               if(!excl[i]){
                  excl.splice(i, 1);
                  i--;
               }
            }
            $(document.body).eq(0).contents().each(function(){
               if(this.nodeType === 3)
                  txt += this.nodeValue;
               else if(this.nodeType === 1 && !(this.nodeName.toUpperCase() === 'SCRIPT')){
                  if(excl && (excl.length > 0)){
                     var found = false;
                     for(var i = 0; i < excl.length; i++){
                        if(excl[i] === this.id){
                           found = true;
                           break;
                        }
                     }
                     if(!found)
                        txt += this.outerHTML;
                  }else
                     txt += this.outerHTML;
               }
            });
            $(event.target).siblings('textarea').val(txt);
         }else if($(this).val() === 'Clear'){
            $(event.target).siblings('textarea').val('');
         }
      });
      
      /*
       * add/remove library button actions:
       * label's text will become the script's id and
       * input's value will become the script's path
       */
      $("form#addRemoveLib legend").click(function(){
         $("form#addRemoveLib div").slideToggle();
      });
      $("form#addRemoveLib button, form#addRemoveLib input[type='button']").click(function(event){
         if($(this).val() === 'Add'){
            var found = false;
            if(nodes.$name.val()){
               $('form#libraries label').each(function(){
                  if($(this).text() === nodes.$name.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  var id = g3.utils.randomString(5);
                  var txt = '<label class="label" for="' + id + '">' +
                            nodes.$name.val() +'</label><input type="checkbox" id="' +
                            id + '" value="' + nodes.$path.val() + '" /><br />';
                  $("#libraries fieldset").append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            var found = -1;
            if(nodes.$name.val()){
               $('form#libraries label').each(function(ndx){
                  if($(this).text() === nodes.$name.val()){
                     found = ndx;
                     return false;
                  }
               });
               if(found > -1){
                  $("form#libraries label").eq(found).next('input').addBack().next('br').addBack().remove();
               }
            }
         }
      });
      
      /*
       * library check box behaviours
       */
      $("#libraries").on('change', 'input', function(event){
         $("#libraries input").each(function(){
            //var $script = $('script[id=\'' + $(this).val() + '\']');
            //label's text is the script's id
            var $script = $(document.getElementById($(this).prev().text()));
            if($script.length === 0 && $(this).prop("checked")){
               //$("body").append($("<script />", {'id': $(this).prev().text(), 'src': $(this).val()}));
               var s = document.getElementsByTagName('body')[0].appendChild(document.createElement('script'));
               s.type = 'text/javascript';
               //input's value is the script's path
               s.src = $(this).val();
               //label's text is the script's id
               s.id = $(this).prev().text();
            }
            if($script.length > 0 && !$(this).prop( "checked" ))
               $script.remove();
         });
      }).change();
      
      /*
       * private variables for active panel, tab and data
       */
      var panelState = {
         $tabbedData: null, /*the active panel*/
         $tab: null, /*the active tab*/
         $data: null /*the data of the active tab*/
      };
      
      /*
       * state of common buttons 'save' and 'save as': 0-disabled, 1-enabled
       * and a handler 'apply()' that accepts a 'state' object as argument
       */
      var buttonState = {
         buttons: {
            save: null,
            saveAs: null
         },
         state: {
            save: 0,
            saveAs: 0
         },
         //apply/remove 'disabled' property on buttons
         apply: function(obj){
            if(obj){
               this.state.save = obj.save;
               this.state.saveAs = obj.saveAs;
            }
            if(this.state.save === 0)
               $(this.buttons.save).prop('disabled', 'disabled');
            else
               $(this.buttons.save).removeAttr('disabled');
            if(this.state.saveAs === 0)
               $(this.buttons.saveAs).prop('disabled', 'disabled');
            else
               $(this.buttons.saveAs).removeAttr('disabled');
            return this;
         },
         //create object references to actual buttons
         init: function(){
            var self = this;
            $("form#blackboard button, form#blackboard input[type='button']").each(function(){
               if($(this).val() === 'Save')
                  self.buttons.save = this;
               if($(this).val() === 'Save to a new tab')
                  self.buttons.saveAs = this;
            });
            return this;
         }
      };
      
      /*
       * disable buttons initially
       */
      if(!panelState.$tabbedData){
         buttonState.init().apply();
      }
      
      /*
       * blackboard button actions
       */
      $("form#blackboard button, form#blackboard input[type='button']").click(function(event){
         if($(this).val() === 'Execute!'){
            _console.rerun = false;
            evalExpr($(event.target).siblings('textarea').val());
         }else if(panelState.$data && $(this).val() === 'Save'){
            if(!nodes.$title.val() || (nodes.$title.val() !== panelState.$tab.text())){
               nodes.$title.after('<span id = "message"><span style="color: red; padding: 0 2px;">Error on title!</span><span id="suggestedTitle" style="cursor: pointer"> Suggested: \''+panelState.$tab.text()+'\' (click to load)</span></span>');
            }else
               panelState.$data.find('pre').text($(event.target).siblings('textarea').val());
         }else if(panelState.$tabbedData && ($(this).val() === 'Save to a new tab')){
            //find tab info at closest parent
            var titles = [], $tabs, length = 1;
            if(panelState.$tab)
               $tabs =  panelState.$tab.closest('.tabs');
            else
               $tabs = $('.tabs', panelState.$tabbedData).eq(0);
            $tabs.find('.tab').each(function(){
               titles.push($(this).text());
            });
            length += $('.tab', $tabs).length;
            if(!nodes.$title.val() || ($.inArray(nodes.$title.val(), titles) >= 0)){
               if(nodes.$title.next('#message').length == 0)
                  nodes.$title.after('<span id = "message"><span style="color: red; padding: 0 2px;">Error on title!</span><span id="suggestedTitle" style="cursor: pointer"> Suggested: \'Tab '+length+'\' (click to load)</span></span>');
            }else{
               $tabs.append('<div class="tabBar"><div class="tab">' + nodes.$title.val() + '</div><div class="close">X</div></div>');
               var $newData;
               if(panelState.$data)
                  $newData = $('<div class="data"><pre></pre></div>').appendTo(panelState.$data.closest('.tabs'));
               else
                  $newData = $('<div class="data"><pre></pre></div>').appendTo($('.tabs', panelState.$tabbedData).eq(1));
               $('pre', $newData)
                  .html($(event.target).siblings('textarea').val());
               if(panelState.$tab)
                  $('pre', $newData).closest('.data').addClass('hide');
            }
         }else if($(this).val() === 'Clear'){
            $(event.target).siblings('textarea').val('');
         }
      });
      
      /*
       * console button actions
       */
       $("form#console button, form#console input[type='button']").click(function(event){
         if($(this).val() === 'Clear'){
            nodes.$console.html('');
         }
      });
      
      /*
       * add/remove panel button actions:
       * label's text will become the script's id and
       * input's value will become the script's path
       */
      $("form#addRemovePanel legend").click(function(){
         $("form#addRemovePanel div").slideToggle();
      });
      $("form#addRemovePanel button, form#addRemovePanel input[type='button']").click(function(event){
         if($(this).val() === 'Add'){
            var found = false;
            if(nodes.$panel.val()){
               $('#tabbedDataWrapper .tabbedData .titleBar .title').each(function(){
                  if($(this).text() === nodes.$panel.val()){
                     found = true;
                     return false;
                  }
               });
               if(!found){
                  var txt = '<div class="gridTabbedData"><div class="tabbedData"><div class="titleBar"><p class="title">' +
                  nodes.$panel.val() + '</p><p class="load">Load tab</p></div><div class="tabs"></div><div class="tabs"></div></div></div>';
                  $('#tabbedDataWrapper').append(txt);
               }
            }
         }else if($(this).val() === 'Remove'){
            var found = -1;
            if(nodes.$panel.val()){
               $('#tabbedDataWrapper .tabbedData .titleBar .title').each(function(ndx){
                  if($(this).text() === nodes.$panel.val()){
                     $(this).closest('.tabbedData').closest('.gridTabbedData').remove();
                     return false;
                  }
               });
            }
         }
      });
      
      /*
       * next to title error message behaviour
       */
      $('form#blackboard').on('click', 'span#suggestedTitle', function(){
            var tmp = $(this).text().match(/'(.*)'/);
            $('form#blackboard input#title').val(tmp[1]);
            $('form#blackboard #message').remove();
      });
      
      /*
       * panel title behaviour: '.tabbedData .titleBar .title'
       * delegator on '.tabbedDataWrapper'
       * defines private 'panelState.$tabbedData' variable
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .titleBar .title', function(event){
         //repeated clicks on panel title
         if(panelState.$tabbedData && (panelState.$tabbedData.find('.titleBar .title').is($(this))))
            return false;
         //enable panel's title
         $(this).addClass('enabled');
         //enable 'save as' button
         buttonState.apply({saveAs: 1});
         //disable 'save' button, previous panel title and tab title when a new panel is activated
         $newTabbedData = $(this).closest('.tabbedData');
         if(panelState.$tabbedData && !($newTabbedData.is(panelState.$tabbedData))){
            buttonState.apply({save: 0});
            panelState.$tabbedData.find('.titleBar .title').removeClass('enabled');
            //panelState.$tabbedData.find('.titleBar .title').addClass('visited');
            //if a tab title fired this event, let private 'panelState.$tab' and 'panelState.$data' to 
            //be handled by it's handler else, nullify them here
            if(panelState.$tab && !event.tabbedData){
               panelState.$tab.removeClass('enabled');
               //panelState.$tab.addClass('visited');
               panelState.$tab = null;
               panelState.$data = null;
            }
         }
         //define new private 'panelState.$tabbedData'
         panelState.$tabbedData = $newTabbedData;
      });
      
      /*
       * load to blackboard behaviour: '.tabbedData .titleBar .load'
       * delegator on '.tabbedDataWrapper'
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .titleBar .load', function(){
         if(panelState.$tabbedData){
            var tmp = '';
            panelState.$tabbedData.find('.tabs .data').each(function(){
               if(!$(this).hasClass('hide'))
                  tmp += $(this).find('pre').text();
            });
            nodes.$blackboard.val(tmp);
            if(panelState.$tab)
               $('input#title').val(panelState.$tab.text());
         }
      });
      
      /*
       * tab title behaviours: '.tabbedData .tabs .tabBar .tab'
       * delegator on '.tabbedDataWrapper'
       * defines private 'panelState.$tabbedData', 'panelState.$tab' and 'panelState.$data' variables
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .tabs .tabBar .tab', function(event){
         var $newTab = $(this);
         //toggle tab title and data on repeated clicks, also, if no tab is enabled 
         //then, nullify variables 'panelState.$tab' and 'panelState.$data' and disable 'save' button
         if(panelState.$tab && panelState.$tab.is($newTab)){
            panelState.$tab.toggleClass('enabled');
            if(panelState.$tab.hasClass('enabled')){
               $('.data', panelState.$tab.closest('.tabbedData')).each(function(){
                  if(panelState.$data.is($(this)))
                     panelState.$data.removeClass('hide');
                  else
                     $(this).addClass('hide');
               });
            }else{
               $('.data', panelState.$tab.closest('.tabbedData')).each(function(){
                  $(this).removeClass('hide');
               });
               buttonState.apply({save: 0});
               panelState.$tab = null;
               panelState.$data = null;
            }
            return false;
         }
         //trigger present panel title behaviour that defines new private 'panelState.$tabbedData'
         // $(this) === $(event.target);
         $newTab.closest('.tabbedData').find('.titleBar .title').trigger({
            type: 'click',
            tabbedData: 'custom'
         });
         //toggle tab title
         if(panelState.$tab){
            panelState.$tab.removeClass('enabled');
            //panelState.$tab.addClass('visited');
         }
         //define new private 'panelState.$tab'
         panelState.$tab = $newTab;
         panelState.$tab.addClass('enabled');
         //panelState.$tab.removeClass('visited');
         //enable buttons
         buttonState.apply({save: 1, saveAs: 1});
         //find tab index in closest parent
         var $tabs = $newTab.closest('.tabs');
         var tab;
         $('.tab', $tabs).each(function(ndx){
            if(this === event.target){
               tab = ndx;
               return false;
            }
         });
         //show relevant content at that index
         $('.data', panelState.$tabbedData).each(function(ndx){
            if(ndx === tab){
               //define new private 'panelState.$data'
               panelState.$data = $(this);
               panelState.$data.removeClass('hide');
            }else
               $(this).addClass('hide');
         });
      });
      
      /*
       * tab close behaviours: '.tabbedData .tabs .tabBar .close'
       * delegators on '.tabs' (do not alter private 'panelState.$tabbedData' variable)
       */
      $('#tabbedDataWrapper').on('click', '.tabbedData .tabs .tabBar .close', function(event){
         //nullify sibling panelState.$tab and connected panelState.$data
         if($(this).siblings('.tab').is(panelState.$tab)){
            buttonState.apply({save: 0});
            panelState.$tab = null;
            panelState.$data = null;
         }
         //find tab index in closest parent
         var $tabs = $(this).closest('.tabs');
         var tab;
         $('.close', $tabs).each(function(ndx){
            if(this === event.target){
               tab = ndx;
               return false;
            }
         });
         //remove relevant data at that index
         $('.data', $tabs.closest('.tabbedData')).each(function(ndx){
            if(ndx === tab){
               $(this).remove();
               return false;
            }
         });
         //remove tab bar
         $(this).closest('.tabBar').remove();
      });
      obj = {
         load: function(selector, url, data, complete){
            $(selector).load(url, data, complete);
            return this;
         },
         loadFrame: function(src){
            $('<iframe>').addClass('frame').prop('src', src).appendTo('#stub');
            return this;
         },
         deleteFrame: function(){
            $('#stub iframe').remove();
            return this;
         },
         cloneFrame: function(selector){
            alert($(selector).length);
            return this;
         }
      };
      return obj;
   }
   return {
      getInstance: function(){
         if(obj)
            return obj;
         else
            return init();
      }
   };
})();
}(window.g3 = window.g3 || {}, jQuery, window, document));