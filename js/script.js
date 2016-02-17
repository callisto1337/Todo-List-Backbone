$(document).ready(function() {

  var Item = Backbone.Model.extend({
    defaults: {
      name: 'Новая задача',
      done: false
    }
  });

  var List = Backbone.Collection.extend({
    model: Item
  });

  var list = new List();

  var ItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click .btnDel': 'destroy'
    },
    render: function() {
      this.$el.html(
        '<div class="text">'+this.model.get('name')+'<span class="btnDel glyphicon glyphicon-remove"></span></div>'+' '
        );
    },
    initialize: function() {
      this.render();
      this.model.on('destroy', this.remove, this);
    },
    destroy: function() {
      this.model.destroy();
      $('#counter').html(list.length + ' active tasks');
    },
    remove: function() {
    this.$el.remove();
    }
  });

  var AppView = Backbone.View.extend({
    el: $('#listContainer'),
    events: {
      'keypress #newTask': 'addItem',
      'click .btnDel': 'collectionLength'
    },
    render: function() {
      this.$el.append('<ul id="list"></ul>');
    },
    initialize: function(error) {
      this.render();
      list.bind('add', this.appendItem);
      _(list.models).each(function(item) {
        appendItem(item);
      });
    },
    addItem: function(e) {
      var valueTask = $('#newTask').val().trim();
      valueTask = valueTask.replace(/[<, >]/g, "");
      if (e.which === 13 && valueTask) {
        var item = new Item({name: valueTask});
        list.add(item);
        valueTask = $('#newTask').val('');
      }
    },
    appendItem: function(item) {
      var itemview = new ItemView({model: item});
      $('#list').append(itemview.el);
      this.conter++;
      $('#counter').html(list.length + ' active tasks');
    }
  });


  var apView = new AppView();

});
