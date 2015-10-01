Vue.filter('dateFormat', function (input, formatString)
{
  if(formatString != undefined){
    return moment(input).format(formatString);
  }
  
  return moment(input).format('DD/MM/YYYY');

});

new Vue({

  el: '#beerApp',

  data:{
    cervejarias: [],
    openDetails: [],
    sortColumn: 'name',
    sortInverse: false,
    filterTerm: '',

  },

  methods:{
    
    doFilter: function(){
      console.log(this.filterTerm);
    },

    doSort: function(ev, column) {
      ev.preventDefault();
      var self = this;
      self.sortColumn = column;
      self.$set('sortInverse', !self.sortInverse);
    },

    doOpenDetails: function(ev, id) {
      ev.preventDefault();

      var self = this;

      index = self.openDetails.indexOf(id);

      if(index > -1){
        self.openDetails.$remove(index);
      }
      else{
        self.openDetails.push(id);
      }
    },

    openAllDetails: function(ev) {

      ev.preventDefault();

      self = this;

      // self.cervejarias.map(function(cervejaria)
      // {
      //   ids.push(cervejaria.id);
      // });

        if(self.openDetails.length > 0){
          self.$set('openDetails', []);
        }
        else{
          self.$set('openDetails', _.pluck(self.cervejarias, 'id'));
        }
      }

  },


  ready: function()
  {
    var self = this;

    self.$http.get('http://beerapi.local/cervejarias', function (response) {
      self.cervejarias = response;
    })

  }

});
