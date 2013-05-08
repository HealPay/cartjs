(function() {
  var extend = function(obj) {
    for(i=0; i<= arguments.length-1; i++) {
      var source = arguments[i];
      for (var prop in source) {
        obj[prop] = source[prop];    
      }
    }
    return obj;
  };
  
  var eventSplitter = /\s+/;
  
  var Events = {
    on: function(events, callback, context) {
      var calls, event, list;
      if (!callback) return this;
      
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});
      
      while (event = events.shift()) {
        list = calls[event] || (calls[event] = []);
        list.push(callback, context);
      }
      
      return this;
    },
    
    off: function(events, callback, context) {
      var event, calls, list, i;
      
      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return this;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }
      
      events = events ? events.split(eventSplitter) : _.keys(calls);
      
      // Loop through the callback list, splicing where appropriate.
      while (event = events.shift()) {
        if (!(list = calls[event]) || !(callback || context)) {
              delete calls[event];
          continue;
        }
        
        for (i = list.length - 2; i >= 0; i -= 2) {
          if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
            list.splice(i, 2);
          }
        }
      }
      
      return this;
    },
    
    trigger: function(events) {
      var event, calls, list, i, length, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      
      rest = [];
      events = events.split(eventSplitter);
      
      // Fill up `rest` with the callback arguments.  Since we're only copying
      // the tail of `arguments`, a loop is much faster than Array#slice.
      for (i = 1, length = arguments.length; i < length; i++) {
        rest[i - 1] = arguments[i];
      }
      
      // For each event, walk through the list of callbacks twice, first to
      // trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        // Copy callback lists to prevent modification.
        if (all = calls.all) all = all.slice();
        if (list = calls[event]) list = list.slice();
        
        // Execute event callbacks.
        if (list) {
          for (i = 0, length = list.length; i < length; i += 2) {
            list[i].apply(list[i + 1] || this, rest);
          }
        }
        
        // Execute "all" callbacks.
        if (all) {
          args = [event].concat(rest);
          for (i = 0, length = all.length; i < length; i += 2) {
            all[i].apply(all[i + 1] || this, args);
          }
        }
      }
      
      return this;
    }
    
  };
  
  Events.bind   = Events.on;
  Events.unbind = Events.off;
  
  // This needs revisiting. It used to store a sessionID. Should instead store encoded JSON blob somehow and provide convenience methods to allow the Cart class easy modification of line items. The interface/API defined here will be the same used for localStorage.
  var CookieStore = {
    isSet: function() {
      return this.get() != undefined ? true : false;
    },
    get: function() {
      var nameEq = this.cookieName + '='
      var ca = document.cookie.split(';');
      for (var i=0; i<=ca.length; i++) {
        var c = ca[i];
        if (c != undefined) {
          while (c.charAt(0) == ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEq) == 0) return c.substring(nameEq.length,c.length);
        }
      }
      return null;
    },
    set: function(id) {
      document.cookie = this.cookieName + '=' + id + this.expires(1) + '; path=/';
    },
    expires: function(days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      return "; expires="+date.toGMTString();
    },
    cookieName: 'cartsession'
  }
  
  var Item = {
    
  }

  // probably don't need grab, create, find, drop. These were legacy from implementation with cartrb.  
  var Cart = extend(Events, {
    store: CookieStore,
    items: {},
    grab: function() {
    },
    create: function() {
    },
    find: function(id) {
    },
    drop: function() {
    },
    addItem: function(item) {
    },
    updateItem: function(id, attributes) {
    },
    removeItem: function(id) {
    }
  });
})
