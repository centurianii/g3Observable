/********************************Object observable******************************
 * Implements the observer pattern or a publish-subscribe system based on 
 * subjects and functions registered under them.
 * Our functions signature is: function (Array(subject, arg1, arg2, ...)).
 * When a message is fired for a specific subject then, all registered functions 
 * are called and an array is passed to them constructed from the arguments of 
 * the notify function.
 * This version uses publisher or observable to push notification messages to 
 * observers in contrast of a pull system where every observer queries the 
 * observable.
 * @module {g3}
 * @function {g3.observable.register}
 * @public
 * @param {Function} 'func' is the function that acts as the observer. A 
 * function can register under many subjects.
 * @param {String} 'subject' is the subject or event under which the function is
 * registered. If it is ommited then it defaults to 'g3'.
 * @param {Object} 'context' is the context under which the function will be 
 * executed. if it is omitted then the function is called as usual.
 * @return {observable} It can be chained.
 * @function {g3.observable.unregister}
 * @public
 * @param {Function} 'func' is the function to unregister.
 * @param {String} 'subject' is the subject or event under which the function 
 * was registered initialy. If it is ommited then it defaults to 'g3'.
 * @param {Object} 'context' is the context under which the function was 
 * registered initialy.
 * @return {Number} It breaks the chain and returns the number of unregistered 
 * functions.
 * @function {g3.observable.notify}
 * @public
 * @param {String} 'subject' is the subject or event of notification.
 * @return {Boolean|Number} It breaks the chain and returns the number of the 
 * functions it calls. If there are no registered functions under this subject 
 * then, it returns false.
 * @function {g3.observable.get}
 * @public
 * @param {String} 'subject' is the subject or event of notification.
 * @return {Object} It breaks the chain and returns the array of objects  
 * [{function, context}, ...] under a subject or the collection of all subjects
 * if subject is null: {length: n, subject1: [{function, context},...], ...}.
 * @function {g3.observable.reset}
 * @public
 * @return {observable} It can be chained. It converts the collection of all 
 * subjects to: {length: 0}.
 *
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 ******************************************************************************/
(function(g3, $, window, document, undefined){
   var observers = {length: 0};
   g3.observable = {
      register: function(func, subject, context){
         subject = subject || 'g3';
         if(!observers[subject])
            observers[subject] = [];
         observers[subject].push({
            'func': func,
            'context': context
         });
         ++observers.length;
         return this;
      },
      unregister: function(func, subject, context){
         subject = subject || 'g3';
         var obs = observers[subject],
             length,
             j = 0;
         if(obs && obs.length)
            length = obs.length;
         else
            return false;
         for(var i = 0; i < length; i++){
            if((obs[i].func === func) && (obs[i].context === context)){
               obs.splice(i, 1);
               length = obs.length;
               j++;
               i--;
            }
         }
         if(length === 0)
            delete observers[subject]; //NOT: delete obs;
         --observers.length;
         return j;
      },
      notify: function(subject){
         var args = arguments,
             obs = observers[subject],
             length,
             j = 0;
         if(obs)
            length = obs.length;
         else
            return false;
         var context;
         for(var i = 0; i < length; i++){
            if((obs[i].context === null) || (typeof obs[i].context != "object"))
               obs[i].func(args);
            else
               obs[i].func.apply(context, args);
            j++;
         }
         return j;
      },
      get: function(subject){
         if(subject)
            return observers[subject];
         else
            return observers;
      },
      reset: function(){
         observers = {length: 0};
         return this;
      }
   }
}(window.g3 = window.g3 || {}, jQuery, window, document));