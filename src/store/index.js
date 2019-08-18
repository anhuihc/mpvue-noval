// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue';
import Vuex from 'vuex';
import dayjs from 'dayjs';
import uniq from 'lodash/uniq';
import remove from 'lodash/remove';
import { HISTORY_WORDS, BOOK_CASE_LIST } from '@/utils/constants';
import fetch from '../utils/fetch';
import { $Message } from '@../../../static/iview/base/index';

import * as Mock from '../mock';

Vue.use(Vuex);

const server="www.xuancheng.store";
// const server="192.168.32.104:8081";

export default new Vuex.Store({
  state: {
    bookCase: [], // 书架列表
    hotWords: [], // 热门关键词
    historyWords: [], // 搜索历史
    searchList: [], // 搜索列表
    bookDetails: {}, // 书籍详情
    booksLike: [], // 猜你喜欢列表
    chapterDetails: {}, // 章节详情
    chapterListData: {}, // 目录
    sourceList: [], // 源数据
    recommendDatas:[], //推荐数据
  },
  mutations: {
    // 获取书架数据
    getBookCase(state, list) {
      const obj = state;
      if (Array.isArray(list)) {
        remove(list, li => !li.id); // 移除脏数据
        obj.bookCase = list;
      }
    },
    // 加入到书架
    addToBookCase(state, book) {
      const obj = state;
      const { bookCase } = obj;
      if (book.id) {
        // 先移除之前有的旧数据
        remove(bookCase, b => b.id === book.id);
        // 顺序
        const { __order = true } = book;
        if (__order) {
          bookCase.push(book);
        } else {
          bookCase.unshift(book);
        }
        // delete book.__order; // eslint-disable-line
        obj.bookCase = bookCase;
        wx.setStorage({
          key: BOOK_CASE_LIST,
          data: JSON.stringify(obj.bookCase)
        });
      }
    },
    // 移除书籍
    removeFromBookCase(state, bookId) {
      const obj = state;
      const { bookCase } = obj;
      remove(bookCase, book => book.id === bookId);
      obj.bookCase = [...bookCase];
      wx.setStorage({
        key: BOOK_CASE_LIST,
        data: JSON.stringify(obj.bookCase)
      });
    },
    // 更新热门关键词
    updateHotWords(state, words = []) {
      const obj = state;
      if (Array.isArray(words) && words.length > 0) {
        obj.hotWords = words;
      }
    },
    // 获取搜索历史
    getSearchList(state, words = []) {
      const obj = state;
      if (Array.isArray(words) && words.length > 0) {
        obj.historyWords = words;
      }
    },
    // 新增搜索历史
    addNewSearchHistory(state, word) {
      const obj = state;
      obj.historyWords.unshift(word);
      wx.setStorage({
        key: HISTORY_WORDS,
        data: JSON.stringify(uniq(obj.historyWords))
      });
    },
    // 清空搜索历史
    resetSearchList(state) {
      const obj = state;
      obj.historyWords = [];
    },
    // 清空搜索列表页面数据
    resetSearchPageList(state) {
      const obj = state;
      obj.searchList = [];
    },
    // 获取搜索数据
    fetchSearchList(state, list = []) {
      const obj = state;
      if (Array.isArray(list) && list.length > 0) {
        obj.searchList = list.slice(0, 20);
      }
    },
    // 获取书籍详情
    fetchBookDetails(state, details) {
      const obj = state;
      obj.bookDetails = details;
    },
    // 猜你喜欢
    fetchBookLikes(state, books = []) {
      const obj = state;
      if (Array.isArray(books)) {
        obj.booksLike = books;
      }
    },
    // 查询书源
    fetchBookSource(state, sourceList) {
      const obj = state;
      if (Array.isArray(sourceList)) {
        obj.sourceList = sourceList;
      }
    },
    // 查章节目录
    fetchChapterList(state, data) {
      const obj = state;
      obj.chapterListData = data;
    },
    // 查章节详情
    fetchChapterDetails(state, details) {
      const obj = state;
      if (details.ok) {
        obj.chapterDetails = details.chapter;
      }
    },
    // 清空章节内容
    resetChapterDetails(state) {
      const obj = state;
      obj.chapterDetails = {};
    },
    // 更新查询
    fetchBookUpdate(state, books) {
      const obj = state;
      const bookCaseTmp = obj.bookCase;
      if (Array.isArray(books)) {
        let hasUpdate = false;
        books.forEach((b) => {
          const target = bookCaseTmp.find(bo => bo.id === b.id);
          // 有更新
          if (+dayjs(target.updateDate) < +dayjs(b.updateDate)) {
            target._hasUpdated = true;
            target.updateDate = b.updateDate;
            target.lastChapter = b.lastChapter;
            hasUpdate = true;
          }
        });
        if (hasUpdate) {
          // const { $Message } = require('static/iview/message/index');
          $Message({
            content: '小说已更新~',
            duration: 3
          });
          // wx.showToast({
          //   title: '小说已更新~',
          //   icon: 'none'
          // });
          obj.bookCase = [...bookCaseTmp];
          wx.setStorage({
            key: BOOK_CASE_LIST,
            data: JSON.stringify(obj.bookCase)
          });
        }
      }
    },
    // 已确认更新
    confirmUpdate(state, bookId) {
      const obj = state;
      const bookCaseTmp = obj.bookCase;
      const book = bookCaseTmp.find(b => b.id === bookId);
      delete book._hasUpdated;
      obj.bookCase = [...bookCaseTmp];
      wx.setStorage({
        key: BOOK_CASE_LIST,
        data: JSON.stringify(obj.bookCase)
      });
    },
    fetchRecommendData(state,data){
      const obj = state;
      console.log(data.classify)
      obj.recommendDatas = data.classify;
    },
  },

  actions: {
    // 更新热门关键词
    async updateHotWords(context) {
      context.commit('updateHotWords', Mock.HOTWORDS_URL.newHotWords);
      // const p = fetch('https://novel.juhe.im/hot-books', null, false);
      // p.then((data) => {
      //   context.commit('updateHotWords', data.newHotWords);
      // }, (err) => {
      //   console.warn(err);
      // });
    },
    // 获取本地存储的搜索历史
    getSearchList(context) {
      wx.getStorage({
        key: HISTORY_WORDS,
        success: (res) => {
          const result = JSON.parse(res.data);
          context.commit('getSearchList', result);
        }
      });
    },
    // 新增搜索历史
    addNewSearchHistory(context, word) {
      context.commit('addNewSearchHistory', word);
    },
    // 清空搜索历史
    resetSearchList(context) {
      wx.removeStorage({
        key: HISTORY_WORDS,
        success: () => {
          context.commit('resetSearchList');
          wx.showToast({
            title: '清空成功',
            icon: 'success'
          });
        }
      });
    },
    // 获取搜索数据
    async fetchSearchList(context, value) {
      let result = {};
      const p = fetch(`https://${server}/api/search?keyword=${value}`, { keyword: value });
      p.then((data) => {
        result = data;
        context.commit('fetchSearchList', result.books);
      }, (err) => {
        console.warn(err);
      });
    },
    // 清空搜索列表页面数据
    resetSearchPageList(context) {
      context.commit('resetSearchPageList');
    },
    // 获取书籍详情
    async fetchBookDetails(context, id) {
      let result = {};
      const p = fetch(`https://${server}/api/bookDetail?bookId=${id}`, null);
      p.then((data) => {
        result = data;
        context.commit('fetchBookDetails', result);
      }, (err) => {
        console.warn(err);
      });
    },
    // 猜你喜欢
    async fetchBookLikes() {
      // let result = {};
      // const p = fetch(`http://novel.juhe.im/recommend/${id}`, null);
      // p.then((data) => {
      //   result = data;
      //   context.commit('fetchBookLikes', result.books);
      // }, (err) => {
      //   console.warn(err);
      // });
    },
    // 查询书源
    async fetchBookSource(context, id) {
      return new Promise((resolve, reject) => {
        fetch(`http://novel.juhe.im/book-sources?view=summary&book=${id}`, null).then((data) => {
          context.commit('fetchBookSource', data);
          resolve(data);
        }, (err) => {
          reject(err);
        });
      });
    },
    // 查章节目录
    // sourceBookId: 对应书源的改书籍的id
    async fetchChapterList(context, id) {
      return new Promise((resolve, reject) => {
        fetch(`https://${server}/api/chapterList?bookId=${id}`, null, false).then((data) => {
          context.commit('fetchChapterList', data);
          resolve(data);
        }, (err) => {
          reject(err);
        });
      });
    },
    // 查章节详情
    async fetchChapterDetails(context, url) {
      let result = {};
      const p = fetch(`https://${server}/api/chapterDetail?link=${url}`, null, false);
      p.then((data) => {
        result = data;
        context.commit('fetchChapterDetails', result);
        wx.hideLoading();
        return result;
      }, (err) => {
        console.warn(err);
      });
    },
    // 清空章节内容
    resetChapterDetails(context) {
      context.commit('resetChapterDetails');
    },
    // 获取书架数据
    getBookCase(context) {
      wx.getStorage({
        key: BOOK_CASE_LIST,
        success: (res) => {
          const result = JSON.parse(res.data);
          context.commit('getBookCase', result);
        }
      });
    },
    // 加入到书架
    addToBookCase(context, book) {
      context.commit('addToBookCase', book);
    },
    // 从书架移除
    removeFromBookCase(context, bookId) {
      context.commit('removeFromBookCase', bookId);
    },
    // 查询更新
    async fetchBookUpdate(context, ids) {
      fetch(`https://${server}/api/bookUpdate?bookId=${ids}`, null, false).then((data) => {
        context.commit('fetchBookUpdate', data);
      }, (err) => {
        console.log(err);
      });
    },
    // 确认更新
    confirmUpdate(context, bookId) {
      context.commit('confirmUpdate', bookId);
    },
    // 获取推荐数据
    fetchRecommendData(context) {
      let result = {};
      const p = fetch(`https://${server}/api/bookStoreMain`, null, false);
      p.then((data) => {
        result = data;
        context.commit('fetchRecommendData', result);
        // wx.hideLoading();
        // return result;
      }, (err) => {
        console.warn(err);
      });
    },
  }
});
