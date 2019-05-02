// Initialize Firebase
var config = {
  apiKey: "AIzaSyADelwnX6NDcpLZZENKA3DpqZL2liDK1aE",
  databaseURL: "https://get-latest-openui5-version.firebaseio.com",
  projectId: "get-latest-openui5-version"
};
firebase.initializeApp(config);
var fb = firebase.app();

var app = new Vue({
  el: '#app',
  data: {
    versions: [],
    listReady: false
  },
  created: function () {
    var db = firebase.firestore();
    var doc = db.collection('versions').doc('savedVersions');
    doc.get()
       .then(function(doc) {
         this.versions = doc.data().versions.split(',');  
         this.listReady=true;    
       }.bind(this))
  }
})