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
    cervejarias:  {
      todasCervejarias:   [],
      listaCervejarias:   []
    },

    pagination:   {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      pageNumbers: []
    },

    interaction:  {
      visibleColumns: ['name', 'last_mod'],
      columnsToFilter: [],
      filterTerm: '',
      openDetails: [],
      sortColumn: 'name',
      sortInverse: false,
    },

    controls:     {
      select2: null
    }
  },

  methods:{

    page: function(ev, page){
      // body...
    },

    next: function(ev){

      ev.preventDefault();

      var self = this;

      self.pagination.$set('currentPage', self.pagination.currentPage+1);
    
    },

    previous: function(ev){

      ev.preventDefault();

      var self = this;

      self.pagination.$set('currentPage', self.pagination.currentPage-1);
    
    },

    doResetAll: function(){
      self = this;

      self.interaction.$set('visibleColumns', ['name', 'last_mod']);
      self.interaction.$set('columnsToFilter', []);
      self.interaction.$set('filterTerm', '');
      self.cervejarias.$set('listaCervejarias', self.cervejarias.todasCervejarias);
      self.interaction.$set('openDetails', []);
      self.interaction.$set('sortColumn', 'name');
      self.interaction.$set('sortInverse', false);

      self.controls.select2.val('').trigger('change') 
    },
    
    doFilter: function(){
    
      var self = this,
      // columnsToFilter = [],
      filtered = self.cervejarias.todasCervejarias;

      if(self.interaction.filterTerm != '' && self.interaction.columnsToFilter.length > 0)
      {
       
        filtered = _.filter(self.cervejarias.todasCervejarias, function(cervejaria)
        {

          return self.interaction.columnsToFilter.some(function(column)
          {
            return cervejaria[column].toLowerCase().indexOf(self.interaction.filterTerm.toLowerCase()) > -1
          });

        });
      
      }
      
      self.cervejarias.$set('listaCervejarias', filtered);
    },

    doSort: function(ev, column){
      ev.preventDefault();

      var self        = this;

      self.interaction.sortColumn = column;

      self.interaction.$set('sortInverse', !self.interaction.sortInverse);
    },

    doOpenDetails: function(ev, id){
      ev.preventDefault();

      var self = this;

      index = self.interaction.openDetails.indexOf(id);

      if(index > -1){
        self.interaction.openDetails.$remove(index);
      }
      else{
        self.interaction.openDetails.push(id);
      }
    },

    openAllDetails: function(ev){

      ev.preventDefault();

      self = this;

      // self.cervejarias.map(function(cervejaria)
      // {
      //   ids.push(cervejaria.id);
      // });

        if(self.interaction.openDetails.length > 0){
          self.interaction.$set('openDetails', []);
        }
        else{
          self.interaction.$set('openDetails', _.pluck(self.cervejarias.listaCervejarias, 'id'));
        }
      }
  },


  ready: function(){
    var self = this;

    self.$http.get('http://beerapi.local/cervejarias', function (response) {
      self.cervejarias.$set('listaCervejarias', response);
      self.cervejarias.$set('todasCervejarias', response);
      
      self.pagination.$set('totalItems', response.length);
      
    });

    self.controls.select2 = jQuery(self.$$.columnsToFilterSelect).select2({
      placeholder: 'Selecione uma ou mais colunas para filtrar!'
    }).on('change', function() {
      // Here "this" is reference to CustomToFilterSelect
      self.interaction.$set('columnsToFilter', jQuery(this).val());
    });
  }

});
