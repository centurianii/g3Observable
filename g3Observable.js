/**
 * Implements the observer pattern or a publish-subscribe system based on 
 * subjects and functions registered under them.
 *
 * - The registration signature is: register(func, subject, context).
 *   If 'subject' is ommited then it's 'any', if 'context' is omitted then 
 *   function is called as usual otherwise it changes context and runs under the 
 *   new one. A function can register under many subjects. It can be chained.
 * - The unregister signature is: unregister(func, subject, context).
 *   It breaks the chain and returns the number of unregistered functions.
 * - Our functions signature is: function ([subject, arg1, arg2, ...]).
 *   When a message is fired for a specific subject then, all registered  
 *   functions are called and an array is passed to them constructed from the 
 *   arguments of the notify function.
 * - get(subject) breaks the chain and returns the array of objects [{function, 
 *   context}, ...] under a subject or the collection of all subjects if 
 *   subject is null: {subject1: [{function, context},...], ...}.
 * - reset() converts the collection of all subjects to: {length: 0}. It can be 
 *   chained.
 *
 * This version uses publisher or observable to push notification messages to 
 * observers in contrast of a pull system where every observer queries the 
 * observable.
 *
 * @version 0.1
 * @author Scripto JS Editor by Centurian Comet.
 * @copyright MIT licence.
 */
(function(g3, $, window, document, undefined){
   var observers = {length: 0};
   g3.Observable = {
      register: function(func, subject, context){
         subject = subject || 'any';
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
         subject = subject || 'any';
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