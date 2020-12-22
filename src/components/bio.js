import React from 'react'
import {StaticQuery, graphql, Link} from 'gatsby'
import Image from 'gatsby-image'
import styled from 'styled-components'
import Button from "./button";

export default function Bio() {
  return <StaticQuery
    query={bioQuery}
    render={data => {
      const {author, email, social, jobTitles} = data.site.siteMetadata
      return <Container>
        <Arrangement>
          <Stack>
            <Blob />
            <Link to="/"
              style={{
                width: `75%`,
                height: `75%`,
                top: `50%`,
                left: `50%`,
                transform: `translate(-50%, -50%)`,
                boxShadow: `none`,
              }}>
              <Image
                style={{
                  width: `100%`,
                  height: `100%`,
                }}
                imgStyle={{
                  objectFit: `contain`
                }}
                fixed={data.avatar.childImageSharp.fixed}
                alt={author} />
            </Link>
          </Stack>
          <Column>
            <Text style={{
              fontSize: `24px`,
              fontWeight: 700,
            }}>Jeff Cannon</Text>
            <Text style={{
              fontSize: `14px`,
              fontWeight: 300,
              marginTop: `8px`,
              textAlign: `center`,
            }}>{jobTitles[Math.floor(Math.random() * jobTitles.length)]}</Text>
          </Column>
        </Arrangement>
        <Row style={{marginTop: `8px`}}>
          <Twitter>{`https://twitter.com/${social.twitter}`}</Twitter>
          <Instagram>{`https://instagram.com/${social.instagram}`}</Instagram>
          <LinkedIn>{`https://www.linkedin.com/in/${social.linkedin}/`}</LinkedIn>
          <SendEmail>{`mailto:${email}`}</SendEmail>
        </Row>
        <ButtonLink href={`mailto:${email}`}>
          <Button>
            <SendIcon />
            <Text style={{
              fontSize: `14px`,
              fontWeight: 700,
              marginLeft: `8px`,
            }}>Oh hi, Jeff!</Text>
          </Button>
        </ButtonLink>
      </Container>
    }} />
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: {regex: "/profile-picture.png/"}) {
      childImageSharp {
        fixed(width: 108, height: 108, quality: 75) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        email
        social {
          instagram
          linkedin
          twitter
        }
        jobTitles
      }
    }
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Column = styled(Container)`
  display: flex;
  flex-direction: column;
`

const Row = styled(Container)`
  flex-direction: row;
  align-items: center;
`

const Stack = styled.div`
  position: relative;
  width: 144px;
  height: 146px;
  > * {
    position: absolute;
  }
  @media (max-width: 720px) {
    width: 108px;
    height: 110px;
  }
`

const Arrangement = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  > * {
    margin: 4px 8px;
  }
  @media (max-width: 720px) {
    flex-direction: row;
    margin-bottom: 0;
  }
`

const Text = styled.div`
  font-family: 'Nunito Sans', sans-serif;
`

const ButtonLink = styled.a`
  text-decoration: none;
  box-shadow: none;
  @media (max-width: 720px) {
    display: none;
  }
`

const IconLink = styled.a`
  margin: 8px;
  transform: scale(1);
  transition: transform 0.1s;
  box-shadow: none;
  :hover, :active {
    color: #252525;
    transform: scale(1.05);
  }
`

const SocialMedia = ({children, href}) => <IconLink href={href}>
  {children}
</IconLink>

const Email = styled(IconLink)`
  display: none;
  margin: 8px;
  @media (max-width: 720px) {
    display: block;
  }
`

const Blob = () => <svg
  style={{
    width: `100%`,
    height: `100%`,
  }}
  width="144"
  height="146"
  viewBox="0 0 144 146"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <g filter="url(#filter0_dd)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M71.3215 6.07228C90.4231 6.9986 105.68 19.6511 117.397 34.2508C128.862 48.5372 136.221 65.5528 133.394 83.4206C130.286 103.072 120.939 123.466 102.038 131.339C83.7135 138.972 64.0782 128.653 46.4374 119.642C29.9432 111.217 13.7888 100.87 8.53682 83.5775C2.91127 65.055 6.73897 44.6846 19.0544 29.4817C31.5045 14.1126 51.1418 5.09367 71.3215 6.07228Z" fill="#252525"/>
  </g>
  <defs>
    <filter id="filter0_dd" x="0" y="0" width="144" height="146" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dx="-1" dy="-2"/>
      <feGaussianBlur stdDeviation="2"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dx="2" dy="4"/>
      <feGaussianBlur stdDeviation="4"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
      <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape"/>
    </filter>
  </defs>
</svg>

const SendIcon = () => <svg
  width="22"
  height="22"
  viewBox="0 0 22 22"
  fill="none"
  xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.7071 0.292921C21.9306 0.516405 22.0262 0.81935 21.9939 1.11081C21.9848 1.19252 21.9657 1.27332 21.9366 1.35121L14.9439 21.3304C14.8084 21.7174 14.4504 21.9825 14.0408 21.9992C13.6311 22.0159 13.2527 21.7808 13.0862 21.4062L9.2424 12.7576L0.593867 8.91384C0.219186 8.74731 -0.0158775 8.36894 0.000836285 7.95926C0.0175501 7.54959 0.282654 7.19162 0.669655 7.05617L20.6488 0.0634782C20.7272 0.0341359 20.8085 0.0149704 20.8907 0.00598197C20.9511 -0.000661909 21.0117 -0.00173777 21.0717 0.00258598C21.3032 0.0191289 21.5301 0.115907 21.7071 0.292921ZM17.1943 3.3915L3.71108 8.11063L9.77854 10.8073L17.1943 3.3915ZM11.1928 12.2215L18.6085 4.80571L13.8894 18.289L11.1928 12.2215Z" fill="currentColor"/>
</svg>

const Twitter = ({children}) => <SocialMedia href={children}>
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3064 4.00008C40.5862 4.01691 49.0817 6.72526 53.6839 12.704C57.9573 18.2557 55.32 25.2254 53.6648 31.7471C51.9851 38.3653 51.0844 45.8288 44.3927 49.3133C37.1568 53.0812 27.6399 52.7715 20.3377 49.1013C13.5574 45.6933 11.6036 38.5967 9.86951 31.961C8.1391 25.3395 6.33332 18.1871 10.8031 12.6169C15.5521 6.69867 24.0015 3.98319 32.3064 4.00008Z" fill="#1DA1F2"/>
      <path d="M43 19.0101C42.0424 19.6855 40.9821 20.2022 39.86 20.5401C39.2577 19.8476 38.4573 19.3567 37.567 19.134C36.6767 18.9112 35.7395 18.9673 34.8821 19.2945C34.0247 19.6218 33.2884 20.2045 32.773 20.9638C32.2575 21.7231 31.9877 22.6224 32 23.5401V24.5401C30.2426 24.5856 28.5013 24.1959 26.931 23.4055C25.3607 22.6151 24.0103 21.4487 23 20.0101C23 20.0101 19 29.0101 28 33.0101C25.9405 34.408 23.4872 35.109 21 35.0101C30 40.0101 41 35.0101 41 23.5101C40.9991 23.2315 40.9723 22.9537 40.92 22.6801C41.9406 21.6735 42.6608 20.4028 43 19.0101V19.0101Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <filter id="filter0_d" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="4"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
    </defs>
  </svg>
</SocialMedia>

const Instagram = ({children}) => <SocialMedia href={children}>
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M32.5771 4.02435C39.6626 4.17689 47.121 5.28256 51.6617 10.9723C56.3026 16.7876 56.8001 24.8992 55.1151 32.2655C53.4542 39.5262 49.2719 45.9329 42.896 49.2923C36.3773 52.7268 28.6799 52.94 22.0849 49.6683C15.443 46.3733 10.8599 39.9522 9.0502 32.5015C7.17948 24.7998 7.51309 16.142 12.481 10.1288C17.2787 4.3216 25.2396 3.8664 32.5771 4.02435Z" fill="url(#paint0_linear)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M27 19C24.7909 19 23 20.7909 23 23V33C23 35.2091 24.7909 37 27 37H37C39.2091 37 41 35.2091 41 33V23C41 20.7909 39.2091 19 37 19H27ZM21 23C21 19.6863 23.6863 17 27 17H37C40.3137 17 43 19.6863 43 23V33C43 36.3137 40.3137 39 37 39H27C23.6863 39 21 36.3137 21 33V23ZM32.4833 24.9892C31.8591 24.8966 31.2217 25.0032 30.6616 25.2939C30.1015 25.5845 29.6473 26.0443 29.3636 26.608C29.0799 27.1716 28.9811 27.8103 29.0814 28.4333C29.1816 29.0563 29.4758 29.6319 29.922 30.0781C30.3681 30.5242 30.9437 30.8184 31.5667 30.9186C32.1897 31.0189 32.8284 30.9201 33.392 30.6364C33.9557 30.3527 34.4155 29.8985 34.7061 29.3384C34.9968 28.7783 35.1034 28.1409 35.0108 27.5167C34.9164 26.88 34.6197 26.2905 34.1646 25.8354C33.7095 25.3803 33.12 25.0836 32.4833 24.9892ZM29.7404 23.5186C30.6739 23.0342 31.7364 22.8565 32.7767 23.0108C33.8378 23.1682 34.8203 23.6626 35.5788 24.4212C36.3374 25.1798 36.8318 26.1622 36.9892 27.2233C37.1435 28.2636 36.9658 29.3261 36.4814 30.2596C35.997 31.1931 35.2306 31.9501 34.2912 32.4229C33.3518 32.8957 32.2873 33.0603 31.2489 32.8932C30.2106 32.7261 29.2514 32.2359 28.5077 31.4923C27.7641 30.7486 27.2739 29.7894 27.1068 28.7511C26.9397 27.7128 27.1043 26.6482 27.5771 25.7088C28.0499 24.7694 28.8069 24.003 29.7404 23.5186ZM37.5 21.5C36.9477 21.5 36.5 21.9477 36.5 22.5C36.5 23.0523 36.9477 23.5 37.5 23.5H37.51C38.0623 23.5 38.51 23.0523 38.51 22.5C38.51 21.9477 38.0623 21.5 37.51 21.5H37.5Z" fill="white"/>
    </g>
    <defs>
      <filter id="filter0_d" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="4"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
      <linearGradient id="paint0_linear" x1="8" y1="52" x2="56" y2="4" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FCAF45"/>
        <stop offset="1" stop-color="#833AB4"/>
      </linearGradient>
    </defs>
  </svg>
</SocialMedia>

const LinkedIn = ({children}) => <SocialMedia href={children}>
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M30.83 4.00035C37.5939 3.95955 43.8814 7.44409 48.3852 13.3515C53.2573 19.742 57.5249 28.1014 55.4725 36.3229C53.4974 44.2346 45.8375 47.3242 39.2094 50.107C33.664 52.4352 27.8739 52.7845 22.4108 50.2036C16.3811 47.355 10.4236 42.9872 8.64343 35.6667C6.77128 27.9682 9.16388 19.7511 13.5002 13.5619C17.7609 7.48077 24.1112 4.04089 30.83 4.00035Z" fill="#0077B5"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M23 20C23 19.4477 23.4477 19 24 19C24.5523 19 25 19.4477 25 20C25 20.5523 24.5523 21 24 21C23.4477 21 23 20.5523 23 20ZM24 17C22.3431 17 21 18.3431 21 20C21 21.6569 22.3431 23 24 23C25.6569 23 27 21.6569 27 20C27 18.3431 25.6569 17 24 17ZM36 25C34.6739 25 33.4021 25.5268 32.4645 26.4645C31.5268 27.4021 31 28.6739 31 30V36H33V30C33 29.2043 33.3161 28.4413 33.8787 27.8787C34.4413 27.3161 35.2043 27 36 27C36.7957 27 37.5587 27.3161 38.1213 27.8787C38.6839 28.4413 39 29.2043 39 30V36H41V30C41 28.6739 40.4732 27.4021 39.5355 26.4645C38.5979 25.5268 37.3261 25 36 25ZM36 23C34.1435 23 32.363 23.7375 31.0503 25.0503C29.7375 26.363 29 28.1435 29 30V37C29 37.5523 29.4477 38 30 38H34C34.5523 38 35 37.5523 35 37V30C35 29.7348 35.1054 29.4804 35.2929 29.2929C35.4804 29.1054 35.7348 29 36 29C36.2652 29 36.5196 29.1054 36.7071 29.2929C36.8946 29.4804 37 29.7348 37 30V37C37 37.5523 37.4477 38 38 38H42C42.5523 38 43 37.5523 43 37V30C43 28.1435 42.2625 26.363 40.9497 25.0503C39.637 23.7375 37.8565 23 36 23ZM21 25C21 24.4477 21.4477 24 22 24H26C26.5523 24 27 24.4477 27 25V37C27 37.5523 26.5523 38 26 38H22C21.4477 38 21 37.5523 21 37V25ZM23 26V36H25V26H23Z" fill="white"/>
    </g>
    <defs>
      <filter id="filter0_d" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="4"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
    </defs>
  </svg>
</SocialMedia>

const SendEmail = ({children}) => <Email href={children}>
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M31.3833 4.0119C38.9022 3.90348 47.0911 4.42396 51.9188 10.3175C56.846 16.3325 56.6793 24.9177 54.7226 32.5038C52.8568 39.7376 48.4289 45.9997 41.863 49.3037C35.2254 52.6438 27.3515 53.0415 20.769 49.5892C14.3679 46.232 10.9811 39.3613 9.28045 32.2153C7.54154 24.9084 6.96214 16.7683 11.5616 10.8994C16.1521 5.04192 24.042 4.11776 31.3833 4.0119Z" fill="url(#paint1_linear)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M42.7071 17.2929C42.9306 17.5164 43.0262 17.8194 42.9939 18.1108C42.9848 18.1925 42.9657 18.2733 42.9366 18.3512L35.9439 38.3304C35.8084 38.7174 35.4504 38.9825 35.0408 38.9992C34.6311 39.0159 34.2527 38.7808 34.0862 38.4062L30.2424 29.7576L21.5939 25.9138C21.2192 25.7473 20.9841 25.3689 21.0008 24.9593C21.0176 24.5496 21.2827 24.1916 21.6697 24.0562L41.6488 17.0635C41.7272 17.0341 41.8085 17.015 41.8907 17.006C41.9511 16.9993 42.0117 16.9983 42.0717 17.0026C42.3032 17.0191 42.5301 17.1159 42.7071 17.2929ZM38.1943 20.3915L24.7111 25.1106L30.7785 27.8073L38.1943 20.3915ZM32.1928 29.2215L39.6085 21.8057L34.8894 35.289L32.1928 29.2215Z" fill="#252525"/>
    </g>
    <defs>
      <filter id="filter0_d" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="4"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
      <linearGradient id="paint1_linear" x1="32" y1="4" x2="32" y2="52" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fff"/>
        <stop offset="1" stop-color="#ddd"/>
      </linearGradient>
    </defs>
  </svg>
</Email>
