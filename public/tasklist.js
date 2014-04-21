$(function() {

var Task = Backbone.Model.extend( 
	{
	// url: '/tasks',
	urlRoot: function() {
        return '/tasks';
    },
	defaults: {
		title: ''
		,description: '"Bitte Ausfüllen"'
		,cost: ''
		,responsible: '"Bitte Ausfüllen"'
		,cost: 1
		,status: 'notStarted'
	},
	toggleTask: function(column, value) {
		if(column === 'title') {
			this.set({title:value});
		}
		else if(column === 'description'){
			this.set({description:value});
		}
		else if(column === 'responsible'){
			this.set({responsible:value});
		}
		else {
			this.set({cost:value});
		}
		this.save();
	},
	toggleStatus: function(value) {
		this.set({status: value});
		this.save({status: value});
	},
	initTask: function(value) {
		this.save({url: this.urlRoot, title: value});
	},
	remove: function() {
		this.destroy();
	}
});
 
var TaskList = Backbone.Collection.extend ({
	model: Task,
	url: '/tasks',
	
	initialize: function(){
	    this.on('remove', this.hide);
	},
	hide: function(model) {
	  	model.trigger('hide'); 
	}
});


// var TaskNotStartedView = Backbone.View.extend({
var TaskView = Backbone.View.extend({
    // template: _.template('<div class="<%= status %>"><%= task %></div>'),
    template: _.template($('#item-template').html()),
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
	  this.model.on('hide', this.remove, this);
    },
    events: {
      "dblclick .view.title": "editTitle",
      "dblclick .view.desc": "editDesc",
      "dblclick .view.resp": "editResp",
      "click .deleteTask": "deleteTask",
      "keyup .edit": "saveOrclose",
      "change select#state": "changeState",
      "change select#cost": "changeCost"
    },
    editTitle: function () {
	  this.$el.find($("input")).val(this.model.get('title'));
      this.$el.addClass("editing").addClass("editTitle");
    },
    editDesc: function () {
	  this.$el.find($("input")).val(this.model.get('description'));
      this.$el.addClass("editing").addClass("editDesc");
    },
    editResp: function () {
	  this.$el.find($("input")).val(this.model.get('responsible'));
      this.$el.addClass("editing").addClass("editResp");
    },
    saveOrclose: function (e) {
    	
    	var remClass = '';
    	var col = '';
     	if(this.$el.hasClass('editTitle')) {
     		col = 'title';
     		remClass = 'editTitle';
     	}
     	else if(this.$el.hasClass('editDesc')) {
     		col = 'description';
     		remClass = 'editDesc';
     	}
     	else if(this.$el.hasClass('editResp')){
     		col = 'responsible';
     		remClass = 'editResp';
     	}
     	
      if (e.keyCode == 13) {
	    var value = this.$el.find($("input")).val();
		this.model.toggleTask(col, value);
	  	this.$el.removeClass("editing");
      }
      else if(e.keyCode == 27) {
      	this.$el.removeClass("editing");
      }
    },
    changeCost: function () {
      var value = this.$el.find($("select#cost")).val();
	  this.model.toggleTask('cost', value);
    },
    changeState: function() {
	    var value = this.$el.find($("select#state")).val();
	    this.$el.removeClass(this.model.get('status'));
	    this.model.toggleStatus(value);
    },
    deleteTask: function() {
    	this.model.remove();
    },
    remove: function(){
      this.$el.remove();
	},
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.addClass(this.model.get('status'));
      return this;
    }
});

var TaskListView = Backbone.View.extend({
    el: $('#app'),
    
    events: {
    	"click #add": "addTask"
    },
    
    initialize: function() {
	  this.collection.on('change', this.render, this);
	  this.collection.on('add', this.render, this);
	  this.collection.on('reset', this.render, this);
      this.collection.fetch({reset: true});
      this.render();
    },
    
	render: function() {
      this.listNotSt = $('#notStarted').empty().append('&nbsp;');
      this.working = $('#working').empty().append('&nbsp;');
      this.finished = $('#finished').empty().append('&nbsp;');
	  this.collection.forEach(this.addOne, this);
	},
	
	addOne: function(taskItem) {
		var taskView = new TaskView({model: taskItem});
		if(taskItem.get('status') === 'notStarted') {
			this.listNotSt.append(taskView.render().el);
		}
		else if(taskItem.get('status') === 'working') {
      		this.working.append(taskView.render().el);
		}
		else {
      		this.finished.append(taskView.render().el);
		}
	},
	
	addTask: function() {
		var value = this.$el.find($("#newTask")).val();
      	this.$el.find($("#newTask")).val('');
        var t = new Task();
		t.initTask(value);
      	this.collection.add(t);
      	
	}
});

var TaskRouter = Backbone.Router.extend({
	routes: {
		"": "index"
	},
	index: function() {
		this.tasks.fetch();
	},
    setApp: function(app) {
      this.app = app;
    },
	initialize: function(options) {
		this.tasks = new TaskList();
		this.taskListView = new TaskListView({collection: tasks});
		
	},
	start: function() {
		Backbone.history.start({pushState: true});
		console.log("blubb");
	}
	
});

var tasks = new TaskList();
	var router = new TaskRouter();
	router.setApp(tasks);
});
