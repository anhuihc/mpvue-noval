<template>
  <div>
    <div class="book-item" @click="onClick" @longpress="onLongpress">
      <image class="book-item_cover" mode="aspectFill" :src="cover" />
      <div class="book-item_body">
        <text class="book-item_title">{{title}}</text>
        <text class="book-item_text">{{content}}</text>
      </div>
      <i class="update-tip" v-if="hasUpdated" />
      <slot></slot>
    </div>
    <i-divider height="5px"></i-divider>
  </div>
</template>

<script>
export default {
  props: ['title', 'content', 'cover', 'hasUpdated'],
  methods: {
    onClick() {
      this.$emit('click');
    },
    onLongpress() {
      this.$emit('longpress');
    }
  }
};
</script>
<style lang="scss">
// 一本书
.book-item {
  display: flex;
  align-items: center;
  padding: 10px 0 10px 0;

  // 书籍封面
  &_cover {
    width: 52px;
    height: 68px;
    margin-right: 15px;
  }
  // 标题
  &_title {
    font-size: 16px;
    display: block;
    margin: 5px 0 10px;
  }
  &_text {
    font-size: 13px;
    color: #666;
    display: block;
  }
  .update-tip{
    position: absolute;
    right: 20px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #4393e2;
  }
}
</style>
