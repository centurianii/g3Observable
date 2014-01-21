describe("Object g3.Observable", function() {
   describe("Basic registration on no subject", function() {
      var o;
      var testObservable = function( args ){
         return(args);
      };
      
      beforeEach(function() {
         o = g3.Observable.register(testObservable);
      });
      
      afterEach(function() {
         o.unregister(testObservable);
      });
      
      it("should be able registration under no context (i.e. 'any') to return the Observable", function() {
         expect(o).toBeDefined();
         expect(o).toEqual(jasmine.any(Object));
      });

      it("should be able to get a hash of subjects with length 1 under no argument", function() {
         expect(o.get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(1);
      });
      
      it("should be able to get an array of observers with length 1 under argument 'any'", function() {
         expect(o.get('any')).toBeDefined();
         expect(o.get('any')).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get('any').length).toEqual(1);
      });
      
      it("should be able to get a length of 0 after reseting the observers", function() {
         expect(o.reset().get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(0);
      });
      
      it("should not be able to get anything under argument 'any'", function() {
         var tmp = o.get('any');
         expect(tmp).not.toBeDefined();
      });
   });
   
   describe("Basic registration on subject", function() {
      var o;
      var testObservable = function( args ){
         return(args);
      };
      
      beforeEach(function() {
         o = g3.Observable.register(testObservable, 'example1');
      });
      
      afterEach(function() {
         o.unregister(testObservable, 'example1');
      });
      
      it("should be able registration under context 'example1' to return the Observable", function() {
         expect(o).toBeDefined();
         expect(o).toEqual(o);
      });
      
      it("should be able to get a hash of subjects with length 1 under no argument", function() {
         expect(o.get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(1);
      });
      
      it("should be able to get an array of observers with length 1 under argument 'example1'", function() {
         expect(o.get('example1')).toBeDefined();
         expect(o.get('example1')).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get('example1').length).toEqual(1);
      });
      
      it("should be able to get a length of 0 after reseting the observers", function() {
         expect(o.reset().get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(0);
      });
      
      it("should not be able to get anything under argument 'example1'", function() {
         var tmp = o.get('example1');
         expect(tmp).not.toBeDefined();
      });
   });
   
   describe("Multiple registration of the same function on a given subject and no subject", function() {
      var o, b;
      var testObservable = function( args ){
         return(args);
      };
      
      beforeEach(function() {
         o = g3.Observable.register(testObservable);
         b = g3.Observable.register(testObservable, 'example1');
      });
      
      afterEach(function() {
         o = g3.Observable.unregister(testObservable);
         b = g3.Observable.unregister(testObservable, 'example1');
      });

      it("both registrations should return the same observable", function() {
         expect(b).toEqual(o);
      });
      
      it("should be able to get a hash of subjects with length 2 under no argument", function() {
         expect(o.get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(2);
      });
      
      it("should be able to get an array of observers with length 1 under argument 'any'", function() {
         expect(o.get('any')).toBeDefined();
         expect(o.get('any')).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get('any').length).toEqual(1);
      });

      it("should be able to get an array of observers with length 1 under argument 'example1'", function() {
         expect(o.get('example1')).toBeDefined();
         expect(o.get('example1')).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get('example1').length).toEqual(1);
      });
      
      it("should be able to get a length of 0 after reseting the observers", function() {
         expect(o.reset().get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(0);
      });
      
      it("should not be able to get anything under argument 'any'", function() {
         var tmp = o.get('any');
         expect(tmp).not.toBeDefined();
      });
      
      it("should not be able to get anything under argument 'example1'", function() {
         var tmp = o.get('any');
         expect(tmp).not.toBeDefined();
      });
   });
   
   describe("Multiple registration of different functions on a given subject", function() {
      var o = g3.Observable;
      var testObservable1 = function( args ){
         console.log(args);
      };
      var testObservable2 = function( args ){
         console.log(args);
      };
      
      beforeEach(function() {
         o.register(testObservable1, 'example1').register(testObservable2, 'example1');
      });
      
      afterEach(function() {
         o.unregister(testObservable1, 'example1');
         o.unregister(testObservable2, 'example1');
      });

      it("should be able to get a hash of subjects with length 2 under no argument", function() {
         expect(o.get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(2);
      });
      
      it("should be able to get a hash of subjects with length 2 under argument 'example1'", function() {
         expect(o.get('example1')).toBeDefined();
         expect(o.get('example1')).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get('example1').length).toEqual(2);
      });
      
      it("should be able to get a length of 0 after reseting the observers", function() {
         expect(o.reset().get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(0);
      });
   });
   
   describe("Notifies on multiple registrations on a given subject", function() {
      var o = g3.Observable;
      var testObservable1 = function( args ){
         console.log(args);
      };
      var testObservable2 = function( args ){
         console.log(args);
      };
      
      beforeEach(function() {
         o.register(testObservable1, 'example1').register(testObservable2, 'example1');
      });
      
      afterEach(function() {
         o.unregister(testObservable1, 'example1');
         o.unregister(testObservable2, 'example1');
      });

      it("should be able to get a hash of subjects with length 2 under no argument", function() {
         expect(o.get()).toBeDefined();
         expect(o.get()).toEqual(jasmine.any(Object)); //core js can't see arrays!
         expect(o.get().length).toEqual(2);
      });
      
      it("should be able to get 2 notifies from the observers", function() {
         expect(o.notify('hello world!')).toEqual(2);
      });
      
      it("should be able to get 1 notify after unregistering 1 observer", function() {
         o.unregister(testObservable1, 'example1');
         expect(o.notify('hello world!')).toEqual(1);
      });
      
      it("should be able to get false after unregistering the last observer", function() {
         o.unregister(testObservable1, 'example1');
         expect(o.notify(['test','a','b','c'])).toBe(false);
      });
   });
});
