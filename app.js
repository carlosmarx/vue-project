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
    cervejaria:{
      name: '',
      city: '',
      state: '',
      country: '',
      descript: ''
    },

    cervejarias:  {
      todasCervejarias:   [],
      listaCervejarias:   [],
      paginated:   []
    },

    pagination:   {
      perPage: 8,
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
      sortInverse: 0,
    },

    controls:     {
      select2: null
    }
  },

  methods:{

    new: function () {
      this.cervejaria.name = '';
      this.cervejaria.city = '';
      this.cervejaria.state = '';
      this.cervejaria.country = '';
      this.cervejaria.descript = '';
      
      jQuery(this.$els.modal).modal('show');
    },

    edit: function (ev, cervejaria) {
      ev.preventDefault();
      // this.$set('cervejaria', cervejaria);
      Vue.set(this, 'cervejaria', cervejaria);
      jQuery(this.$els.modal).modal('show');
    },

    save: function(ev) {
      ev.preventDefault();

      // this.$http.post('url/save', cervejaria, function(response) {
      //   jQuery(this.$els.modal).modal('hide');
      //   window.alert('Cervejaria salva, seu bebâdo');
      // });
      
      jQuery(this.$els.modal).modal('hide');
      window.console.log(JSON.stringify(this.cervejaria));
      window.alert('Cervejaria salva, seu bebâdo');
    },

    setPaginationData: function(listaCervejarias) {
      var self = this;
      chunk    = _.chunk(listaCervejarias, self.pagination.perPage);

      Vue.set(self.cervejarias, 'paginated', chunk);  
      Vue.set(self.cervejarias, 'listaCervejarias', chunk[0]);

      Vue.set(self.pagination, 'currentPage', 1);  
      Vue.set(self.pagination, 'totalItems', listaCervejarias.length);  
      Vue.set(self.pagination, 'totalPages', Math.ceil(listaCervejarias.length / self.pagination.perPage));  
      Vue.set(self.pagination, 'pageNumbers', _.range(1, self.pagination.totalPages+1));  
    },

    page: function(ev, page){
       ev.preventDefault();
       var self = this;

       Vue.set(self.pagination, 'currentPage', page);
       Vue.set(self.cervejarias, 'listaCervejarias', self.cervejarias.paginated[page-1]);  

    },

    next: function(ev){

      ev.preventDefault();

      var self = this;

      if(self.pagination.currentPage == self.pagination.totalPages){
        return false;
      }

      Vue.set(self.pagination, 'currentPage', self.pagination.currentPage+1);
      Vue.set(self.cervejarias, 'listaCervejarias', self.cervejarias.paginated[self.pagination.currentPage-1]);  

    },

    previous: function(ev){

      ev.preventDefault();

      var self = this;

      if(self.pagination.currentPage == 1){
        return false;
      }

      Vue.set(self.pagination, 'currentPage', self.pagination.currentPage-1);

      Vue.set(self.cervejarias, 'listaCervejarias', self.cervejarias.paginated[self.pagination.currentPage-1]);  

    
    },

    doResetAll: function(){
      self = this;

      // self.cervejarias.$set('listaCervejarias', self.cervejarias.todasCervejarias);

      Vue.set(self.interaction, 'visibleColumns', ['name', 'last_mod']);  
      Vue.set(self.interaction, 'columnsToFilter', []);  
      Vue.set(self.interaction, 'filterTerm', '');  
      Vue.set(self.interaction, 'openDetails', []);  
      Vue.set(self.interaction, 'sortColumn', 'name');  
      Vue.set(self.interaction, 'sortInverse', 0);  

      self.setPaginationData(self.cervejarias.todasCervejarias);

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
      
      // self.cervejarias.$set('listaCervejarias', filtered);
      
      self.setPaginationData(filtered);
    },

    doSort: function(ev, column){
      ev.preventDefault();

      var self        = this;

      self.interaction.sortColumn = column;

      if (self.interaction.sortInverse == 0) 
      {
        Vue.set(self.interaction, 'sortInverse', -1);  
      }
      else
      {
        Vue.set(self.interaction, 'sortInverse', 0);  
      }

    },

    doOpenDetails: function(ev, id){
      ev.preventDefault();

      var self = this;

      index = self.interaction.openDetails.indexOf(id);

      if(index > -1){
        self.interaction.openDetails.$remove(id);
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
          Vue.set(self.interaction, 'openDetails', []);  
        }
        else{
          Vue.set(self.interaction, 'openDetails', _.pluck(self.cervejarias.listaCervejarias, 'id'));  
        }
      }
  },

  ready: function(){
    var self = this;

    self.$http.get('http://beerapi.local/cervejarias', function (response)
    {

      Vue.set(self.cervejarias, 'todasCervejarias', response);  
      
      self.setPaginationData(response);
    });

    self.controls.select2 = jQuery(self.$els.columnsToFilterSelect).select2({
      placeholder: 'Selecione uma ou mais colunas para filtrar!'
    }).on('change', function() {
      // Here "this" is reference to CustomToFilterSelect
      Vue.set(self.interaction, 'columnsToFilter', jQuery(this).val());  
    });
  }

});
