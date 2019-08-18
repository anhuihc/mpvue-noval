<template>
  <div class="history-page">
    <!-- 搜索 -->
    <div class="search-bar">
      <i class="iconfont icon-search"></i>
      <input
        type="text"
        confirm-type="search"
        class="search-input"
        :placeholder="placeholder"
        :disabled="readonly"
        :focus="focus"
        :value="searchValue"
        @input="onValue"
        @confirm="onSearch"
      />
    </div>
    <!--    <SearchBar readonly @click="gotoSearchPage()"/>-->
    <!-- 其他内容 -->
    <div class="history-container" v-show="!showList">
      <div class="history-title">
        <span style="font-size: 16px">大家都在搜</span>
        <span @click="changeHotWords" style="font-size: 13px"><i class="iconfont icon-refresh"/> 换一批</span>
      </div>
      <ul class="history-hotwords">
        <li v-for="(item, index) in hotWords" :key="index" @click="gotoSearchPage(item.word)">{{item.word}}</li>
      </ul>
      <div class="history-title" style="margin-top:10px">
        <span style="font-size: 16px">搜索历史</span>
        <span @click="clearSearchHistory" style="font-size: 13px"><i class="iconfont icon-trash"/> 清 空</span>
      </div>
      <ul class="history-list">
        <li v-for="(item, index) in historyWords" :key="index" @click="gotoSearchPage(item)" style="font-size: 14px"><i
          class="iconfont icon-history"></i> {{item}}
        </li>
      </ul>
    </div>
    <div class="search-list" v-show="showList">
      <BookItem
        v-for="(book, index) in searchList"
        :key="index"
        :title="book.title"
        :content="`${book.author} 著`"
        :cover="getImgSrc(book.cover)"
        @click="gotoDetailPage(book.id)"
      />
    </div>
  </div>
</template>

<script>
    import sampleSize from 'lodash/sampleSize';
    import SearchBar from '@/components/SearchBar';
    import store from '@/store';
    import BookItem from '@/components/BookItem';
    import {getImgSrc} from '@/utils';
    import fetch from '../../utils/fetch';

    export default {
        data() {
            return {
                hotWords: [], // 热门关键词
                searchValue: '', // 搜索关键词
                showList: false,
                placeholder: '输入书名或者作者名',
                readonly: false,
                focus: false,
                searchList: []
            };
        },
        components: {
            BookItem,
            SearchBar
        },
        computed: {
            // 所有热门关键词
            totalHotWords() {
                return store.state.hotWords;
            },
            // 搜索历史
            historyWords() {
                return store.state.historyWords;
            },
            // // 搜索列表数据
            // searchList() {
            //     return store.state.searchList;
            // }
        },
        methods: {
            getImgSrc,
            // 获取热门关键词
            async fetchHotWords() {
                await store.dispatch('updateHotWords');
                // setTimeout(() => {
                this.changeHotWords();
                // }, 300);
            },
            // 更换热门关键词,随机八个
            changeHotWords() {
                this.hotWords = sampleSize(this.totalHotWords, 8); // 随机八个
            },
            // 清空本地搜索记录
            clearSearchHistory() {
                store.dispatch('resetSearchList');
            },
            onSearch() {
                this.showList = true;
                store.dispatch('addNewSearchHistory', this.searchValue);
                fetch(`https://www.xuancheng.store/api/search?keyword=${this.searchValue}`, null).then((data) => {
                    let result=data.books;
                    if (Array.isArray(result) && result.length > 0) {
                        this.searchList = result.slice(0, 20);
                    } else {
                        wx.showToast({
                            title: '未找到数据哦~',
                            icon: 'none'
                        });
                    }
                    // context.commit('fetchSearchList', result.books);
                }, (err) => {
                    console.warn(err);
                });
                // store.dispatch('fetchSearchList', this.searchValue);
            },
            // 跳转详情页面
            gotoDetailPage(bookId) {
                wx.navigateTo({
                    url: `/pages/details/main?bookId=${bookId}`
                });
            },
            // // 跳转搜索页面
            gotoSearchPage(query = '') {
                this.searchValue = query;
                this.onSearch();
            },
            onValue(event) {
                this.searchValue = event.mp.detail.value;
                if (!event.mp.detail.value) {
                    this.showList = false
                }
            }
        },
        onLoad() {
            this.fetchHotWords();
            // 获取本地存储的搜索历史
            store.dispatch('getSearchList');
        },
        onUnload() {
            this.showList = false;
            this.searchValue = '';
        }
    };
</script>

<style lang="scss" scoped>
  .history-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .history-container {
    padding: 10px 20px;
    flex: 1;
    height: 0;
    overflow: scroll;
    font-size: 12px;
  }

  // 区域头
  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    span {
      color: #333;
      display: inline-flex;
      align-items: center;
    }

    .iconfont {
      margin-right: 5px;
      font-size: 14px;
    }
  }

  // 关键词
  .history-hotwords {
    height: 210rpx;
    overflow: hidden;
    margin-bottom: 0px;
    $colors: (#03a9f4, #f589f5, #f74d5b, #f5a15d, #935df5, #5cd2f2, #c1f559, #919);

    li {
      display: inline-block;
      padding: 5px 10px;
      color: #fff;
      border-radius: 4px;
      margin: 0 10px 10px 0;
      @for $i from 1 through length($colors) {
        &:nth-of-type(#{$i}) {
          background-color: nth($colors, $i);
        }
      }
    }
  }

  // 搜索历史
  .history-list {
    color: #333;

    li {
      display: flex;
      align-items: center;
      padding: 8px 0;

      .iconfont {
        margin-right: 10px;
      }
    }
  }

  .search-bar {
    padding: 10px 20px 12px;
    position: relative;

    .search-input {
      background-color: #eee;
      border-radius: 40px;
      padding: 5px 10px 5px 35px;
      font-size: 14px;
      color: #333;
    }

    .icon-search {
      position: absolute;
      left: 30px;
      top: 50%;
      transform: translateY(-55%);
      color: #999;
    }
  }
  .search-list{
    padding: 0 25px;
    flex: 1;
    height: 0;
    overflow: auto;
  }
</style>
