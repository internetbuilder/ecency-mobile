import React, { memo } from "react";
import { View, ImageBackground } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import RenderHTML, { CustomRendererProps, Element, TNode } from "react-native-render-html";
import styles from "./postHtmlRendererStyles";
import { LinkData, parseLinkData } from "./linkDataParser";
import { IconButton } from "..";


interface PostHtmlRendererProps {
  contentWidth:number;
  body:string;
  setSelectedImage:(imgUrl:string)=>void;
  setSelectedLink:(url:string)=>void;
  onElementIsImage:(imgUrl:string)=>void;
  handleOnPostPress:(permlink:string, authro:string)=>void;
  handleOnUserPress:(username:string)=>void;
  handleTagPress:(tag:string)=>void;
  handleVideoPress:(videoUrl:string)=>void;
  handleYoutubePress:(videoId:string)=>void;
}

export const PostHtmlRenderer = memo(({
    contentWidth,
    body,
    setSelectedImage,
    setSelectedLink,
    onElementIsImage,
    handleOnPostPress,
    handleOnUserPress,
    handleTagPress,
    handleVideoPress,
    handleYoutubePress,
  }:PostHtmlRendererProps) => {

     //new renderer functions
  body = body.replace('<center>', '<div class="text-center">').replace('</center>','</div>');

  const _handleOnLinkPress = (data:LinkData) => {

    if(!data){
      return;
    }

    const {
      type,
      href,
      author,
      permlink,
      tag,
      videoHref,
    } = data;

    try {

      switch (type) {
        case '_external':
        case 'markdown-external-link':
          setSelectedLink(href);
          break;
        case 'markdown-author-link':
          if (handleOnUserPress) {
            handleOnUserPress(author);
          }
          break;
        case 'markdown-post-link':
          if (handleOnPostPress) {
            handleOnPostPress(permlink, author);
          }
          break;
        case 'markdown-tag-link':
          if(handleTagPress){
            handleTagPress(tag);
          }
          break;
  
        case 'markdown-video-link':
          if(handleVideoPress){
            handleVideoPress(videoHref)
          }
          break;
        case 'markdown-video-link-youtube':
          if(handleYoutubePress){
            handleYoutubePress(tag)
          }
      
          break;

        //unused cases
        // case 'markdown-witnesses-link':
        //   break;
        // case 'markdown-proposal-link':
        //   break;
        default:
          break;
      }
    } catch (error) {}
  };
  
  
    const _onElement = (element:Element) => {
      if(element.tagName === 'img' && element.attribs.src){
        const imgUrl = element.attribs.src;
        console.log("img element detected",  imgUrl);
        onElementIsImage(imgUrl)
      }
    };
  
    const _anchorRenderer = ({
      InternalRenderer,
      tnode,
      ...props
    }:CustomRendererProps<TNode>) => {
  
      const _onPress = () => {
        console.log("Link Pressed:", tnode)
        const data = parseLinkData(tnode);
        _handleOnLinkPress(data);
       
      };
  
      return (
        <InternalRenderer
          tnode={tnode}
          onPress={_onPress}
          {...props}
        />
      );
    }
  
  
    const _imageRenderer = ({
      InternalRenderer,
      tnode,
      ...props
    }:CustomRendererProps<TNode>) => {
  
      const _onPress = () => {
        const imgUrl = tnode.attributes.src;
        console.log("Image Pressed:", imgUrl)
        setSelectedImage(imgUrl);
      };
  
      const isVideoThumb = tnode.classes?.indexOf('video-thumbnail') >= 0;
      const isAnchored = !(tnode.parent?.classes?.indexOf('markdown-external-link') >= 0)
  
      if(isVideoThumb){
        return (
          <View pointerEvents={'none'}>
            <ImageBackground
              source={{uri:tnode.attributes.src}}
              style={{...styles.videoThumb, height:contentWidth * 9/16 }}
              resizeMode={'cover'}> 
              <IconButton
                style={styles.playButton}
                size={44}
                name='play-arrow'
                color={EStyleSheet.value('$white')}
                iconType='MaterialIcons'
              />
            </ImageBackground>
        </View>
        )
      }
      else {
        return (
          <InternalRenderer
            tnode={tnode}
            onPress={isAnchored && _onPress}
            {...props}/>
        );
      }
    
    }
  
   return (
    <RenderHTML 
      source={{ html:body }}
      contentWidth={contentWidth}
      baseStyle={{...styles.baseStyle, width:contentWidth}}
      classesStyles={{
        phishy:styles.phishy,
        'text-justify':styles.textJustify,
        'text-center':styles.textCenter
      }}
      tagsStyles={{
        body:styles.body,
        a:styles.a,
        img:styles.img,
        th:styles.th,
        tr:styles.tr,
        td:styles.td,
        blockquote:styles.blockquote,
        code:styles.code,
        p:styles.p
      }}
      domVisitors={{
        onElement:_onElement
      }}
      renderers={{
        img:_imageRenderer,
        a:_anchorRenderer,
      }}
      
    />
   )
  }, (next, prev)=>next.body === prev.body)
