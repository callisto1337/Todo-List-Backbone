$(document).ready(function() {
  var Item = Backbone.Model.extend({
    defaults: {
      title: 'Новая задача'
    }
  });

  var List = Backbone.Collection.extend({
    model: Item,
    localStorage: new Backbone.LocalStorage("todos-backbone")
  });

  var list = new List;
  list.fetch();

  var ItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click .btnDel': 'destroy'
    },
    render: function() {
      this.$el.html('<span class="liText"> '+
        this.model.get('title')+'</span><span class="btnDel glyphicon glyphicon-remove"></span> '
      );
    },
    initialize: function() {
      this.render();
      this.model.on('destroy', this.remove, this);
    },
    destroy: function() {
      this.model.destroy();
    },
    remove: function() {
    this.$el.remove();
    }
  });

  var AppView = Backbone.View.extend({
    el: $('#listContainer'),
    events: {
      'keypress #newTask': 'addItem'
    },
    initialize: function(error) {
      this.counterTasks();
      this.render();
      this.displayAll();
      list.on('add', this.counterTasks);
      list.on('add', this.appendItem);
      list.bind('destroy', this.counterTasks);
    },
    addItem: function(e) {
      var valueTask = $('#newTask').val().trim();
      valueTask = valueTask.replace(/[<,>]/g, "");
      if (e.which === 13 && valueTask) {
        var item = new Item({title: valueTask});
        list.add(item);
        item.save();
        valueTask = $('#newTask').val('');
      }
    },
    appendItem: function(item) {
      var itemview = new ItemView({model: item});
      $('#list').append(itemview.el);
    },
    displayAll: function() {
      _(list.models).each(function(item) {
        var itemview = new ItemView({model: item});
        $('#list').append(itemview.el);
      });
      this.counterTasks();
    },
    counterTasks: function() {
      $('#counter').html(list.length + ' active tasks');
    }
  });

  var appView = new AppView();
});
