g3Observable
============

A javascript object that implements the observer or pub/sub pattern.

Implements the observer pattern or a publish-subscribe system based on subjects and functions registered under them.
<ul>
<li>The registration signature is: <code>register(func, subject, context)</code>.<br />
If 'subject' is ommited then it's 'any', if 'context' is omitted then function is called as usual otherwise it changes context and runs under the new one. A function can register under many subjects. It can be chained.</li>
<li>The unregister signature is: <code>unregister(func, subject, context)</code>.<br />
It breaks the chain and returns the number of unregistered functions.</li>
<li>Our functions signature is: <code>function ([subject, arg1, arg2, ...])</code>.<br />
When a message is fired for a specific subject then, all registered functions are called and an array is passed to them constructed from the arguments of the notify function.</li>
<li><code>get(subject)</code><br />
breaks the chain and returns the array of objects <code>[{function, context}, ...]</code> under a subject or the object of all subjects if subject is null: <code>{subject1: [{function, context}, ...], ...}</code>.</li>
<li>reset()<br />
converts the object of all subjects to: <code>{length: 0}</code>. It can be chained.</li>
</ul>

This version uses publisher or observable to <b>push</b> notification messages to observers in contrast of a <b>pull</b> system where every observer queries the observable.

Purpose
=======
It will become part of our javascript plugin extension mechanism using object mixin techniques and allowing the user to extend the behaviour of any (jQuery, whatever) plugin with the help of a class library.

Testing
=======
The <code>g3.Emulator</code> is used to test functioning behaviour of this object along with jasmine v.2.0.

<h3>How our code is constructed?</h3>
<pre>
my source files (g3), necessary libraries (jquery) and my tests folder (tests):
client
  :
  |-jquery
  :  :
  |-g3
  :  |-g3Observable.js
  :  :
  |-tests
  |  |-jasmine-standalone-2.0.0
  |  |  |-lib
  |  |  |-spec
  :  :  :
  |  |-g3
  |  :  |-g3Observable-SpecRunner.html (this file)
  |  :  |-g3Observable-Spec.js
  |  :  |-g3Observable-SpecHelper.js
  :  :  :
</pre>

There are two <code>g3</code> folders one contains the actual code and the other under tests contains the test files.

<h3>Do you need help?</h3>
<h4>Yesss please!</h4> Jasmine is a tough animal to handle!

Have fun!
