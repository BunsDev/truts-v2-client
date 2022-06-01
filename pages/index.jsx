import Head from 'next/head'
import styles from './Home/home.module.scss'
import { useState, useEffect } from 'react'
import axios from 'axios'

// COMPONENTS
import Button from '../components/Button'
import DAOCard from '../components/DAOCard'
import Footer from '../components/Footer'

// ASSETS
import searchIcon from '../assets/icons/search_white.svg'
import heroGraphic from '../assets/hero_graphic.svg'
import statcard_1 from '../assets/statcard_1.svg'
import statcard_2 from '../assets/statcard_2.svg'
import statcard_3 from '../assets/statcard_3.svg'
import gold_medal from '../assets/icons/gold_medal.svg'
import silver_medal from '../assets/icons/silver_medal.svg'
import bronze_medal from '../assets/icons/bronze_medal.svg'
import blank_medal from '../assets/icons/blank_medal.png'
import starFilled from '../assets/icons/star_filled.svg'
import starBlank from '../assets/icons/star_blank.svg'
import web_w from '../assets/icons/web_white.svg'
import twitter_w from '../assets/icons/twitter_white.svg'
import discord_w from '../assets/icons/discord_white.svg'



// CONSTANTS
const API = process.env.API
const CATEGORY_LIST = ['all', 'Service', 'Investment', 'Social', 'Community', 'Education', 'Media', 'Collector', 'Art', 'Sports', 'Event']

// MAIN COMPONENT
export default function Home({ daoList_ssr, leaderboard_ssr }) {

  //data states
  const [daoList, setdaoList] = useState(daoList_ssr);
  const [leaderboard, setleaderboard] = useState(leaderboard_ssr)

  useEffect(() => {
    getDynamicCategoryDaoList(setdaoList);
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Hero />
        <StatCards />
        <CommunitiesWall daoList={daoList} />
        <Leaderboard data={leaderboard} />
        <Leaderboard_mobile data={leaderboard} />
      </main>
      <RecentReviewsSection />
      <Footer />
    </div>
  )
}

//SSR DATA HOME PAGE
export async function getServerSideProps(ctx) {
  // Fetch data from external API
  let res = await Promise.all(
    [getDaolistAPI(), getLeaderboard()]
  )
  // Pass data to the page via props
  return { props: { daoList_ssr: res[0], leaderboard_ssr: res[1] } }
}

// API CALLS

//get list of daos
const getDaolistAPI = async (setter) => {
  //gets initial 20 doas
  let url = `${API}/dao/get-dao-list?limit=20&page=1`;
  let res = await axios.get(url);
  let dao_data_obj = {};
  CATEGORY_LIST.forEach((ele) => {
    dao_data_obj[ele] = [];
  })
  dao_data_obj['all'] = res.data.results
  return dao_data_obj;
}

//get Leaderboard
const getLeaderboard = async (setter) => {
  let url = `${API}/dao/leaderboard`;
  let res = await axios.get(url);
  //console.log(res.data)
  return res.data
}

//get 20 Dynamic category based Daos  
const getDynamicCategoryDaoList = async (setter) => {
  CATEGORY_LIST.forEach((cat) => {
    if (cat == 'all') return
    let url = `${API}/dao/similar?category=${cat}&page=1&limit=20`;
    axios.get(url).then((res) => {
      setter((prev) => {
        prev[cat] = res.data.results;
        return { ...prev }
      })
    });
  })
}


// HERO COMPONENT
function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.hero_left}>
        <h1>Contribute, Reviews &</h1>
        <h1 className={styles.gradientText}>Communities.</h1>
        <p>Discover, Contribute, Review and Earn with cool communities you love, Anonymously!</p>
        <div className={styles.cta_btns}>
          <Button label={'Search Truts'} icon={searchIcon.src} />
          <Button type={'secondary'} label={'Explore DAOs'} />
        </div>
      </div>
      <div className={styles.hero_right}>
        <img src={heroGraphic.src} alt="" />
      </div>
    </div>
  )
}

// STAT CARD COMPONENT
function StatCards() {
  return (
    <div className={styles.statCardsSection}>
      <div className={styles.statCard1}>
        <span className={styles.text1}><span className={styles.colorText_card1}>Discover, Join and Contribute</span> to DAOs </span>
        <img src={statcard_1.src} alt="" />
      </div>
      <div className={styles.statCard2}>
        <span className={styles.text2}>Earn tips for your <span className={styles.colorText_card2}>genuine reviews</span></span>
        <img src={statcard_2.src} alt="" />
      </div>
      <div className={styles.statCard3}>
        <span className={styles.text3}>100% fully <span className={styles.colorText_card3}>On-chain, Anonymous</span> and Gasless</span>
        <img src={statcard_3.src} alt="" />
      </div>
    </div>
  )
}

// COMMUNITY WALL
function CommunitiesWall({ daoList }) {

  const [selectedTab, setselectedTab] = useState('all');
  const [scrollPosDefault, setscrollPosDefault] = useState(false);

  const categoryTabsOnScroll = (e) => {
    const scrollPos = document.querySelector('#cat_container').scrollLeft
    if (scrollPos > 1) {
      setscrollPosDefault(true)
    }
    else {
      setscrollPosDefault(false);
    }
  }

  const scrolltoEnd = () => {
    document.querySelector('#cat_container').scrollLeft = 99999;
  }
  const scrolltoStart = () => {
    document.querySelector('#cat_container').scrollLeft = 0;
  }

  let categoryTabs = CATEGORY_LIST.map((ele, idx) => {
    return (
      <button
        id={`t${idx}`}
        onClick={() => {
          setselectedTab(ele);
        }}
        className={(ele == selectedTab) ? styles.categoryTabSelected : styles.categoryTab} key={'cat' + idx}>
        {ele}
      </button>
    )
  })


  return (
    <div className={styles.wall_of_communties}>
      <h1 className={styles.sec_title}>Our Wall of Communities</h1>
      <div className={styles.categoryTabConWrapper}>
        {(scrollPosDefault) && <button className={styles.scrollStart} onClick={scrolltoStart} />}
        <div id='cat_container' className={styles.categoryTabCon} onScroll={categoryTabsOnScroll}>
          {categoryTabs}
        </div>
        {(!scrollPosDefault) && <button className={styles.scrollEnd} onClick={scrolltoEnd} />}
      </div>
      <div className={styles.cardCon} key={selectedTab}>
        {
          daoList[selectedTab].map((ele, idx) => {
            return (
              <DAOCard key={'card' + idx} data={ele} />
            )
          })
        }
      </div>
      <Button label={"See More"} type={'secondary'} />
    </div>
  )
}

// LEADERBOARD COMPONENT

let StarRating = ({ rating, showCount, color }) => {
  return (
    <div className={styles.starRating}>
      <span className={styles.stars} style={(color == 'black') ? { filter: 'invert(1)' } : null}>
        {
          [1, 2, 3, 4, 5].map((ele) => {
            let starSrc = (ele <= rating) ? starFilled.src : starBlank.src
            return (
              <img alt='' key={'s' + ele} src={starSrc} />
            )
          })
        }
      </span>
      {(showCount) && <p className={styles.rating_count}>(456)</p>}
    </div>
  )
}

let Entry = ({ idx, data }) => {
  let medal_src;
  switch (idx) {
    case 1: { medal_src = gold_medal.src; break; }
    case 2: { medal_src = silver_medal.src; break; }
    case 3: { medal_src = bronze_medal.src; break; }
    default: { medal_src = blank_medal.src }
  }

  return (
    <>
      <ul className={styles.entry}>
        <li className={styles.c1}>
          <span>
            #{idx}
          </span>
          <img className={styles.medal} src={medal_src} alt="" />
        </li>
        <li className={styles.c2}>{data.dao_name}</li>
        <li className={styles.c3}><StarRating rating={data.average_rating} showCount={true} /></li>
        <li className={styles.c4}>
          <img src={twitter_w.src} alt="" onClick={() => {
            (data.twitter_link) && openNewTab(data.twitter_link)
          }} />
          <img src={discord_w.src} alt="" onClick={() => {
            (data.website_link) && openNewTab(data.discord_link)
          }} />
          <img src={web_w.src} alt="" onClick={() => {
            (data.website_link) && openNewTab(data.website_link)
          }} />
        </li>
      </ul>
      <span className={styles.divider} />
    </>
  )
}

function Leaderboard({ data }) {
  return (
    <div className={styles.leaderboard}>
      <h1 className={styles.leaderboard_title}>Our DAO Leaderboard</h1>
      <ul className={styles.tableHead}>
        <li className={styles.th1}>Position</li>
        <li className={styles.th2}>Name of the DAO</li>
        <li className={styles.th3}>Ratings</li>
        <li className={styles.th4}>Socials</li>
      </ul>
      <div className={styles.leaderboard_entries}>
        {
          data.map((ele, idx) => {
            return (
              <Entry key={idx + 'l'} idx={idx + 1} data={ele} />
            )
          })
        }
      </div>
    </div>
  )
}

// MOBILE LEADERBOARD 

function Leaderboard_mobile_entry({ idx, data }) {
  let medal_src;
  switch (idx) {
    case 1: { medal_src = gold_medal.src; break; }
    case 2: { medal_src = silver_medal.src; break; }
    case 3: { medal_src = bronze_medal.src; break; }
    default: { medal_src = blank_medal.src }
  }
  return (
    <div className={styles.mobile_leaderboard_entry}>
      <span className={styles.medal}>
        <img src={medal_src} alt="" />
      </span>
      <span>
        <h1>{data.dao_name}</h1>
        <StarRating color={'white'} rating={data.average_rating} />
      </span>
      <div className={styles.socialIcons}>
        <img src={twitter_w.src} alt="" onClick={() => {
          (data.twitter_link) && openNewTab(data.twitter_link)
        }} />
        <img src={discord_w.src} alt="" onClick={() => {
          (data.website_link) && openNewTab(data.discord_link)
        }} />
        <img src={web_w.src} alt="" onClick={() => {
          (data.website_link) && openNewTab(data.website_link)
        }} />
      </div>
    </div>
  )
}

function Leaderboard_mobile({ data }) {
  return (
    <div className={styles.mobile_leaderboard_con}>
      <h1 className={styles.sec_title}>Our DAO Leaderboard</h1>
      <div className={styles.leaderboard_list}>
        {data.map((ele, idx) => {
          return (<Leaderboard_mobile_entry data={ele} key={'ml' + idx} idx={idx + 1} />)
        })
        }
      </div>
    </div>
  )
}

// RECENT REVIEWS

function RecentReview() {
  return (
    <div className={styles.recentReview}>
      <p className={styles.review_text}>Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint. Sunt qui esse pariatur duis deserunt mollit dolore cillum minim tempor enim. Elit aute irure tempor cupidatat incididunt sint.</p>
      <div className={styles.profile}>
        <span className={styles.profile_img}>

        </span>
        <span className={styles.info}>
          <h1>Van Nga</h1>
          <p>Bankless DAO</p>
          <StarRating rating={4} color={'black'} />
        </span>
      </div>
    </div>
  )
}

function RecentReviewsSection() {

  const [motion, setmotion] = useState(true);

  useEffect(() => {
    setTimeout(() => { setmotion(false) }, 1000)
  }, [])

  useEffect(() => {
    let nodes = document.querySelectorAll(`.${styles.recentReview}`)
    nodes.forEach((node) => {
      node.style.animationPlayState = (!motion) ? 'paused' : 'running';
    })
  }, [motion])

  return (
    <div className={styles.recentReviewsCon}>
      <h1 className={styles.sec_title}>Recent reviews</h1>
      <div className={styles.reviewCon}
        onMouseEnter={() => {
          setmotion(true);
        }}
        onMouseLeave={() => {
          setmotion(false);
        }}
      >
        <div id={'slider1'} className={styles.row_review_1}>
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
        </div>
        <div id={'slider2'} className={styles.row_review_2}>
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
          <RecentReview />
        </div>
      </div>
    </div>
  )
}

const openNewTab = (url) => {
  if (url.length < 1) return
  let a = document.createElement('a');
  a.target = '_blank';
  a.href = url;
  a.click();
}