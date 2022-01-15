'use strict';

SwaggerUi.Views.SidebarHeaderView = Backbone.View.extend({
  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  events: {
    'click [data-endpoint]': 'clickSidebarItem'
  },

  render: function () {
    $(this.el).html(Handlebars.templates.sidebar_header(this.model));

    this.addSidebarItem({
      nickname : "HEADER",
      parentId : this.model.operation.parentId
    }, -1);
    for (var i = 0; i < this.model.operationsArray.length; i++) {
      var item = this.model.operationsArray[i].operation;
      item.nickname = this.model.operationsArray[i].nickname;
      item.parentId = this.model.operation.parentId;
      this.addSidebarItem(item, i);
    }

    return this;
  },

  addSidebarItem: function (item, i) {
    var sidebarItemView = new SwaggerUi.Views.SidebarItemView({
      model: item,
      tagName: 'div',
      className : 'item',
      attributes: {
          "data-endpoint": item.parentId + '_' + item.nickname
      },
      router: this.router,
      swaggerOptions: this.options.swaggerOptions
    });
    var itm = sidebarItemView.render().el;
    $(itm).addClass(i == -1 ? 'hidden' : 'nohidden');  
    $(this.el).append(itm);//.addClass();
  },

  clickSidebarItem: function (e) {

    var elem = $(e.target);
    var data_point = jqlean(elem.attr("data-endpoint"))
    var eln = $("#" + data_point);

    if (elem.is(".item")) {
      scroll(data_point);
      setSelected(elem);
      updateUrl(eln.find(".path a").first().attr("href"))
    }

    /* scroll */
    function scroll(elem) {
      console.log("Item",elem);
      var i = $(".sticky-nav").outerHeight();
      console.log("scrollscrollscroll",elem);
      var r = $("#" + elem).offset().top - i - 10;
      matchMedia() && (r = $("#" + elem).offset().top - 10);
      scrollT(r)
    }

    /set selected value and select operation (class) */
    function setSelected(element) {
      {
        var nav = $(".sticky-nav [data-navigator]");
        $("#" + jqlean(element.attr("data-endpoint")))
      }
      nav.find("[data-resource]").removeClass("active");
      nav.find("[data-selected]").removeAttr("data-selected");
      element.closest("[data-resource]").addClass("active");
      element.attr("data-selected", "");
      $(".sticky-nav").find("[data-selected-value]").html(element.text())
    }

    /* update navigation */
    function updateUrl(element) {
      history.pushState && history.pushState(null, null, element)
    }

    function matchMedia() {
      return window.matchMedia("(min-width: 992px)").matches
    }

    function scrollT(e) {
      if ("self" === e) {
        var n = $(window).scrollTop();
        return $(window).scrollTop(n)
      }

      return $(window).scrollTop(e)
    }
  }

});