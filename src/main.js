import Promise from 'bluebird';
import Vue from 'vue';
import App from './App';

Vue.config.productionTip = false;
App.mpType = 'app';

global.Promise = Promise;
const app = new Vue(App);
app.$mount();


