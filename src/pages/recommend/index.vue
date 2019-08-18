<template>
  <div>
    <scroll-view :style="{height:(heightX)+'px'}" scroll-y class="scroll-view" @scroll="scroll">
      <SearchBar readonly @click="gotoSearchPage()"/>
      <div v-for="(item, index) in recommendDatas"
           :key="index"
           style="display: flex;flex-direction: column;justify-content: flex-start;align-content: center;background-color: #fefefe">
        <div
          style="display: flex;flex:1;flex-direction: row;justify-content: flex-start;align-content: center;border-bottom: 1px solid #cccccc;margin-left:20px;margin-right: 20px">
          <div
            style="display: flex;flex:1;height:50rpx;flex-direction: row;justify-content: flex-start;align-content: center;align-items: center;">
            <text style="font-size: 15px;">{{item.classify}}</text>
          </div>
          <div
            style="display: flex;flex:1;height:50rpx;flex-direction: row;justify-content: flex-end;align-content: center;align-items:center">
            <text style="font-size: 12px">查看更多</text>
            <i-icon type="enter" size="15" color="#ccc"/>
          </div>
        </div>

        <div @click="nextDetail(item.id)"
             style="display: flex;flex-direction: row;justify-content: flex-start;align-items:center">
          <div style="display: flex;justify-content: center;align-items:center;margin: 5px 10px 10px 20px;">
            <image style="width:200rpx;height:280rpx"
                   :src="item.cover"></image>
          </div>

          <div style="display: flex;flex-direction: column;height:280rpx;margin: 5px 20px 10px 0px;">
            <div style="height:40rpx;font-size: 15px;">
              <text>{{item.title}}</text>
            </div>
            <div
              style="height:200rpx;font-size: 13px;display: flex;flex-direction: column;justify-content: center;align-items:center">
              <text class="text">{{item.shortIntro}}</text>
            </div>
            <div style="height:30rpx;font-size: 12px;">
              <text>{{item.classify}}</text>
            </div>
          </div>
        </div>
        <div :style="{width:widthX-60}" class="scroll-div">
          <scroll-view  class="scrollImage" scroll-x enable-flex>
            <div v-for="(data, key) in item.dataList"
                 :key="key">
              <div @click="nextDetail(data.id)"
                   style="display: flex;flex-direction: column;width:140rpx;height:320rpx;justify-content: flex-start;align-items:center;margin-right: 20px;">
                <image style="width:140rpx;height:200rpx"
                       :src="data.cover"></image>
                <text style="margin-top: 10rpx;font-size: 13px;width: 140rpx;">{{data.title}}</text>
              </div>
            </div>
          </scroll-view>
        </div>

      </div>
    </scroll-view>
  </div>
</template>

<script>
    import SearchBar from '@/components/SearchBar';
    import store from '@/store';

    export default {
        data() {
            return {
                heightX: wx.getSystemInfoSync().windowHeight,
                widthX: wx.getSystemInfoSync().windowWidth,
                test: 1
            }
        },
        computed: {
            recommendDatas() {
                return store.state.recommendDatas;
            },
        },
        components: {
            SearchBar
        },
        methods: {
            scroll(event) {

            },
            nextDetail(bookId) {
                wx.navigateTo({
                    url: `/pages/details/main?bookId=${bookId}`
                });
            },
            loadFirst() {
                store.dispatch('fetchRecommendData');
            },
            gotoSearchPage() {
                wx.navigateTo({
                    url: '/pages/history/main'
                });
            }
        },
        onLoad() {
            this.loadFirst();
        }
    }
</script>

<style lang="scss" scoped>
  .text {
    display: -webkit-box; /*设置为弹性盒子*/
    -webkit-line-clamp: 4; /*最多显示5行*/
    overflow: hidden; /*超出隐藏*/
    text-overflow: ellipsis; /*超出显示为省略号*/
    -webkit-box-orient: vertical;
    word-break: break-all; /*强制英文单词自动换行*/
  }

  .scrollImage {
    height: 320 rpx;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .scroll-div{
    margin-left: 20px;
    margin-right: 20px;
  }

</style>
