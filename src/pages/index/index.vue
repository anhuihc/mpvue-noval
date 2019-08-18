<template>
  <div class="home-page">
    <i-notice-bar icon="systemprompt" closable loop>
      感谢您使用本小程序，有任何问题请联系作者!
    </i-notice-bar>
    <i-message id="message"/>
    <div :class="['refresh-bar', {show: refreshing}]">
      <i></i>
      <i></i>
      <i></i>
    </div>
    <!--    <scroll-view :style="{height:(heightX-50)+'px'}" scroll-y>-->
    <div class="book-list">
      <BookItem1
        v-for="(item, index) in bookList"
        :key="index"
        :title="item.title"
        :content="`${formatTime(item.updateDate)}：${item.lastChapter}`"
        :cover="getImgSrc(item.cover)"
        :hasUpdated="item._hasUpdated"
        @click="gotoChapterPage(item.id)"
        @longpress="removeBook(item)"
      />
      <!--    <BookItem-->
      <!--      v-for="(item, index) in bookList"-->
      <!--      :key="index"-->
      <!--      :title="item.title"-->
      <!--      :content="`${formatTime(item.updateDate)}：${item.lastChapter}`"-->
      <!--      :cover="getImgSrc(item.cover)"-->
      <!--      :hasUpdated="item._hasUpdated"-->
      <!--      @click="gotoChapterPage(item.id)"-->
      <!--      @longpress="removeBook(item)"-->
      <!--    />-->
    </div>
    <div class="home-add" @click="gotoSearchPage">
      <i class="iconfont icon-add"></i>
      <span>添加你喜欢的小说</span>
    </div>
    <!--    </scroll-view>-->
    <!--    <div style="position: absolute;bottom: 10px;width:100%;height:30px">-->
    <!--      <div style="display: flex;flex:1;flex-direction: column;justify-content: center;align-items: flex-end">-->
    <!--        <text style="font-size: 12px;color: #ddd" selectable>作者:山椒剁鱼头</text>-->
    <!--        <text style="font-size: 12px;color: #ddd" selectable>QQ群:869427083</text>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>

</template>
<script>
    import BookItem from '@/components/BookItem';
    import BookItem1 from '@/components/BookItem1';
    import {getImgSrc, formatTime} from '@/utils';
    import store from '@/store';

    export default {
        data() {
            return {
                refreshing: false, // 是否在刷新
                heightX: wx.getSystemInfoSync().windowHeight,
            };
        },
        components: {
            BookItem,
            BookItem1,
        },
        computed: {
            // 书架列表
            bookList() {
                return store.state.bookCase;
            }
        },
        methods: {
            formatTime,
            getImgSrc,
            // 跳转搜索历史页
            gotoSearchPage() {
                wx.navigateTo({
                    url: '/pages/history/main'
                });
            },
            // 跳转详情页面
            gotoChapterPage(bookId) {
                wx.navigateTo({
                    url: `/pages/chapter/main?bookId=${bookId}`
                });
                store.dispatch('confirmUpdate', bookId);
            },
            // 从书架移除
            removeBook(book) {
                wx.showModal({
                    title: '提示',
                    content: `确认从书架移除 ${book.title} ?`,
                    success(res) {
                        if (res.confirm) {
                            store.dispatch('removeFromBookCase', book.id);
                        }
                    }
                });
            }
        },
        // 下拉刷新的时候查询有无更新
        async onPullDownRefresh() {
            this.refreshing = true;
            const ids = this.bookList.map(book => book.id) || [];
            await store.dispatch('fetchBookUpdate', ids.join(','));
            setTimeout(() => {
                this.refreshing = false;
                wx.stopPullDownRefresh();
            }, 500);
        },
        onLoad() {
            store.dispatch('getBookCase');
            setTimeout(() => {
                if (this.bookList && this.bookList.length >= 1) {
                    wx.startPullDownRefresh();
                }
            }, 500);
        } ,
        onShareAppMessage(book) {
            return {
                title: `好友向你推荐了一本好书——${book.title}`,
                path: `/pages/details/main?bookId=${book.id}`,
                imageUrl: getImgSrc(book.cover)
            };
        }
    };
</script>

<style lang="scss" scoped>
  @keyframes loading {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  .refresh-bar {
    position: fixed;
    top: 0;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    display: none;

    &.show {
      display: flex;
    }

    i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #999;
      margin: 0 5px;
      @for $i from 1 through 3 {
        &:nth-of-type(#{$i}) {
          animation: loading .5s ease #{$i * .3s} infinite alternate;
        }
      }
    }
  }

  /*.book-list {*/
  /*  padding: 0 15px;*/
  /*}*/

  .home-page {
    background-color: #FEFEFE;
  }

  .home-add {
    display: flex;
    align-items: center;
    height: 54px;
    color: #333;
    font-size: 16px;

    .iconfont {
      margin: 0 20px 0 17px;
    }

    span {
      color: #333;
    }
  }
</style>
