import * as React from "react";
import styled from "@emotion/styled";

const AboutMeContainer = styled.div`
  p {
    margin-bottom: 1em;
    text-indent: 2em;
    line-height: 1.5;
  }

  strong {
    color: blue;
  }
`;

const Poetry = styled.code`
  display: block;
  text-align: center;
`;

export default function AboutMe() {
  return (
    <AboutMeContainer>
      <p>
        我，XGHeaven，徐田洋，是一个前端、Noder，向往着全栈。2018
        年毕业，现就职于杭州字节跳动团队，一个专业吹水的人。
      </p>
      <p>
        1996
        年，我出生在一个又爱又恨的大山东潍坊，虽然自己从小生活在市中心，但是过的却和农村一样，准确说思想上和农村一样。
      </p>
      <p>
        陪伴度过我学习时代的只有那一台 <b>512M</b> 内存的电脑。
        我在上面学习了前端、ASP、数据库、FLASH、MAYA、PR，也这是因为这些，
        让我的高中生活一直活跃在<b>「潍坊一中」</b>的<b>「潍阳电视台」</b>，
        可以说是全中国少有的高中电视台。
        在这里面接触到了后期影视编辑、摄像、甚至如果做一个演员，也结交了很多好朋友。
      </p>
      <p>
        当然了，后期影视、3D 渲染只是我的副业，那个时候我的主业还是
        NOIP，毕竟代码还是我的生活，参加 NOIP 是我在学校能接触电脑的唯一机会。
        （其实是想进入后期制作的世界，对电脑要求太高了，很难想象那个时候当我安装了
        AE 之后，却提示我最少要 2G 内存，我内心的崩溃，那个之后我只有 512M
        的内存）
        当然因为自己太蠢，最后只拿到了全国二等奖，就差一步就可以保送，不过这并不重要。
      </p>
      <p>
        2014
        年高考结束，投志愿的时候看到了「杭州电子科技大学」，一下子看对上了眼。
        细细想来，应该是高中刷题的时候上过杭电 ACM
        平台。再加上前面的几个志愿都差一两分，于是阴差阳错的来到
        <strong>杭州</strong>，开启了我新的杭电生活。
      </p>
      <p>
        那个时候，对于我一个从小到大从未出过远门，从未走过超出家 3
        公里的地方的我来说，杭州真的一个梦寐以求的地方。
        当然了，原来历史老师所讲的南方比北方发展好原来是真的。
        我家可以说在市中心，如果按照杭州来讲的话，就是在东站附近几公里的位置，讲道理我对这里应该很了解才对。
        可是事实相反，我对我家附近几乎一无所知，除了平时上学的几条线路。
        然而我到现在一到杭州，变对杭州充满的了探索的欲望，就短短几年所知道的路比在家接近二十几年知道的还要多。
      </p>
      <p>
        也不怕大家笑话，来了杭州之后，第一次知道原来西湖在杭州，第一次知道原来阿里巴巴在杭州，第一次知道原来杭州在浙江，
        第一次知道原来雷峰塔在西湖，第一次知道原来三潭映月在西湖，第一次知道原来还有快速公交，第一次知道原来地铁是怎么回事，
        第一次知道原来潍坊是那么小，第一次知道原来南方人这么喜欢洗澡，第一次知道原来南方几乎家家有空调。
        是的，虽然这些东西电视上、书本上都讲过，而且我的地理也不差，但是这些终究是纸面上的东西，对我来说，中国的其他省份只是一幅画，一幅很大很大的画，
        其他地方的新闻只是离我非常非常远。
        虽然我当初是几乎山东省内第一的分进入的杭电，我不喜欢书呆子，可是我最后却成为了书呆子。
        我喜欢听窗外事，国内、国外、伊拉克、欧盟，但是这些窗外事对我来说只是一段解码之后的音频，我能复述内容，但是却永远无法理解内容。
      </p>
      <p>
        以前从来没有觉得旅游是一件有钱人才能做得事情，高中初中时代，从来没有出去旅游过的人听到别人讲到各个城市怎样怎样，我心中想到的第一件事情是你们真有钱。
        我从来也没有看过车票、飞机票的价格，因为我感觉就很<b>贵</b>。
        但是当我要来杭州上学的时候，我才真正意识到，原来出来旅游真的不贵，潍坊到杭州的机票最低
        160，高铁 450，快车 200 多。
        广州、深圳、北京，在我上大学之前是想都不敢想的事情，现在看来，眼睛一闭一睁，我就到了，而且还不贵。
      </p>
      <p>
        大学的四年，是我成长最快的时候，第一次觉得自己前面十几年白活了。从生活、学习、娱乐方方面面，一点一点的改变着我，让我认识到之前的自己是多么愚蠢无知。
        换句话说，大学，我学会了如何去了解一个城市、了解一个地方、了解一个圈子，并融入一个城市、融入一个地方、融入一个圈子。这是我大学四年最大的收获。
      </p>
      <p>
        当然了，大学也是我成功进军前端圈的重要之路，当时因为初中的时候攒下了一点前端的基础，成功进入了
        <b>「红色家园」</b>技术部。 里面结交了不少的大佬，学习了很多新的技术。
        也第一次学会使用 Chrome Dev Tools，我最开始学习前端的时候，还是 IE6
        的时代，那个时候全程 alert debug，可想而知
      </p>
      <p>
        在前端大佬们的带领下，我学习到了 Bootstrap、Angular、Backbone
        等等，而且还有一定的移动端开发经验，毕竟很多的活动页面都是要在微信上用的。
        当然 CSS
        预处理，打包工具也是必须了解的。而且最重要的是，不仅仅只有前端，后端也有所涉猎。
        PHP、MySQL、MemCache、Redis、Docker 等等，还有最最重要的
        Node.js，算是开启了我全栈之路。
      </p>
      <p>
        于是，大学就是在这样学习、实践、再学习的过程中不断充实着自己，每当有什么新的技术，总是第一时间就可以使用上。
        也一直保持着自己对技术的追求和渴望，希望终有一天，自己能够成为自己心目中的那个大牛、大佬。
      </p>
      <p>前端路漫漫，我们且行且珍惜。</p>
      <Poetry>
        2018 年末有感
        <br />
        <br />
        旧时艳阳伴，今日雪舞压。
        <br />
        冬夏数轮回，我已身入职。
        <br />
        山高人则高，山矮人难高。
        <br />
        若有愚公志，人高则山高。
        <br />
        但今不似古，有智胜有志。
        <br />
        智在先人上，志在后人下。
        <br />
        如今有两法，踏得俊山峰。
        <br />
        内有山基变，外有高山寻。
      </Poetry>
    </AboutMeContainer>
  );
}
