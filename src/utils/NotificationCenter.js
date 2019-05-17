export function NotificationCenter() {
  var regtable = {};

  this.register = function(event, callback) {
    var reciverlist = regtable[event] || [];
    reciverlist.push(callback);
    regtable[event] = reciverlist;
  };

  this.unregister = function(event, callback) {
    var reciverlist = regtable[event] || [];
    var mark = -1;
    for (var i = 0; i < reciverlist; i++) {
      if (reciverlist[i] == callback) {
        mark = i;
        break;
      }
    }
    if (mark != -1) {
      reciverlist.splice(mark, 1);
    }
  };

  this.send = function(event, props) {
    var reciverlist = regtable[event];
    if (reciverlist) {
      for (var i = 0; i < reciverlist.length; i++) {
        reciverlist[i](props);
      }
    }
  };
  return this;
}
