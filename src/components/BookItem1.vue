<template>
  <i-swipeout style="padding: 0;" :actions="actions" @change="onChange" unclosable :toggle="toggle">
        <div slot="content"   class="book-item" @click="onClick" @longpress="onLongpress">
          <image class="book-item_cover" mode="aspectFill" :src="cover" />
          <div class="book-item_body">
            <text class="book-item_title">{{title}}</text>
            <text class="book-item_text">{{content}}</text>
          </div>
          <i class="update-tip" v-if="hasUpdated" />
          <slot></slot>
        </div>
<!--        <i-divider height="5px"></i-divider>-->
  </i-swipeout>
</template>

<script>
    export default {
        props: ['title', 'content', 'cover', 'hasUpdated'],
        data(){
          return {
              toggle:false,
              actions : [
                  {
                      name : '删除',
                      width : 80,
                      color : '#fff',
                      fontsize : '18',
                      background : '#ed3f14'
                  }
              ]
          }
        },
        methods:{
            onClick() {
                this.$emit('click');
            },
            onChange(event) {
                if(event.target.index===0){
                    this.toggle=true;
                    this.$emit('longpress');
                    setTimeout(()=>{
                        this.toggle=false;
                    },300)
                }
            },
            onLongpress() {
                this.$emit('longpress');
            }
        },
        name: "BookItem1"
    }
</script>

<style scoped lang="scss">
  .book-item {
    display: flex;
    align-items: center;
    padding: 10px 0 10px 0;

  // 书籍封面
  &_cover {
       width: 52px;
       height: 68px;
       margin-right: 15px;
       margin-left: 15px;
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
  .i-swipeout-item{
    padding: 0;
  }
</style>
