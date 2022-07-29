import { useState, useEffect } from 'react';
import styles from '../styles/components/userPopup.module.scss';
import Image from 'next/image'
import { getCookie } from 'cookies-next';
import { socket } from '../lib/socket';

export default function UserPopup({ targetGitId, onClick ,myInfo}) {

    const [info, setInfo] = useState({});
    const [nodeId, setNodeId] = useState();
    const [isFollow, setIsFollow] = useState(false);

    useEffect(() => {
        getUserInfo()
        setNodeId(getCookie('nodeId'))
        // setFollow()
      },[])
    
    useEffect(() => {
      myInfo?.following?.map(userNodeId => {
        if(userNodeId === info.nodeId) {
          setIsFollow(true);
        }
      });
    },[info])

    // const setFollow = (() => {
    //   myInfo?.following?.map(userNodeId => {
    //     console.log(userNodeId,info.nodeId,info)
    //     if(userNodeId === info.nodeId) {
    //       setIsFollow(true);
    //     }
    //   });
    // })

    const getRankName = (rank, ranking) => {
      let myrank = 'Bronze';
      switch (rank) {
        case 0:
          myrank = 'Bronze';
          break;
        case 1:
          myrank = 'Silver';
          break;
        case 2:
          myrank = 'Gold';
          break;
        case 3:
          myrank = 'Platinum';
          break;
        case 4:
          myrank = 'Diamond';
          break;
        case 5:
          myrank = 'Master';
          break;
        default:
          myrank = 'Bronze'
      }
      if (ranking === 1) {
        myrank = 'King';
      }
      return myrank;
    };
  
    const getRankImg = (rank, ranking) => {
      let imgUrl = '/rank/rank0.png';
      switch (rank) {
        case 0:
          imgUrl = '/rank/rank0.png';
          break;
        case 1:
          imgUrl = '/rank/rank1.png';
          break;
        case 2:
          imgUrl = '/rank/rank2.png';
          break;
        case 3:
          imgUrl = '/rank/rank3.png';
          break;
        case 4:
          imgUrl = '/rank/rank4.png';
          break;
        case 5:
          imgUrl = '/rank/rank5.png';
          break;
        default:
          imgUrl = '/rank/rank0.png';
      }
      if (ranking == 1) {
        imgUrl = '/rank/king.png';
      }
      return imgUrl;
    };

    const getUserInfo = async () => {
        await fetch(`/server/api/user/getUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gitId: targetGitId
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setInfo(data.UserInfo);
                    // console.log("showmedata!@!@!@!#!@#!@#!@",data.UserInfo)
                }
            })
            .catch(error => console.log('[/pages/mypage] getUserInfo error >> ', error));
        };

    const onClickFollow = () => {
        console.log("emit follow")
        socket.emit('followMember', info.gitId);
        setIsFollow(true);
        };
    
    const onClickUnFollow = () => {
        console.log("emit unfollow")
        socket.emit('unFollowMember', info.gitId);
        setIsFollow(false);
        };

    return (
        <div className={styles.popupBackground}>
            {/* <div className={styles.popupBox}> */}
                <div className={styles.infoTab}>
                    <div className={styles.myProfileBox}>
                      <div className={styles.myProfileHeader}>
                        <div className={styles.myProfileTitle}>내 정보</div>
                        {       
                          isFollow
                          ? <div className={styles.inviteBtnClicked} onClick={onClickUnFollow}>언팔로우</div>
                          : <div className={styles.inviteBtn} onClick={onClickFollow}>팔로우</div>
                        }
                      </div>
                      <div className={styles.myProfileBody}>
                        <div className={styles.myInfoRow}>
                          <div className={styles.myProfileIcon}>
                            <Image src={info.avatarUrl ?? '/default_profile.jpg'} width={80} height={80} className={styles.myProfileIcon} alt="프로필이미지" />
                            <div className={styles.myRank}>
                              <Image src={getRankImg(info.rank, info.ranking) ?? '/rank/rank0.png'} width={30} height={30} className={styles.rankIcon} alt="프로필이미지" />
                            </div>
                          </div>
                          <div className={styles.myInfoCol}>
                            <div className={styles.nickname}>{info?.gitId}</div>
                            <div className={styles.rankBox}>
                              <div className={styles.fieldTitle}>{getRankName(info?.rank, info?.ranking) ?? 0}</div>
                              <div className={styles.pointText}>{`${info?.totalScore ?? 0 * 5} Point`}</div>
                            </div>
                          </div>
                        </div>
                        <div className={styles.splitterHorizontal} />
                        <div className={styles.myInfoRow}>
                          <div className={styles.myInfoCol}>
                            <div className={styles.fieldTitle}>내 랭킹</div>
                            <div className={styles.percentText}>{`${info?.ranking ?? 0}등 (상위 ${info?.rankingPercent}%)`}</div>
                          </div>
                          <div className={styles.splitterVertical} />
                          <div className={styles.myInfoCol}>
                            <div className={styles.fieldTitle}>사용 언어</div>
                            <div className={styles.percentText}>{info?.mostLanguage ?? ''}</div>
                          </div>
                        </div>
                        <div className={styles.splitterHorizontal} />
                        <div className={styles.myInfoRow}>
                          <div className={styles.myInfoCol}>
                            <div className={styles.fieldTitle}>평균 통과율</div>
                            <div className={styles.percentText}>{`${parseInt(info?.totalPassRate / (info?.totalSolo + info?.totalTeam)) ?? 0}%`}</div>
                          </div>
                          <div className={styles.splitterVertical} />
                          <div className={styles.myInfoCol}>
                            <div className={styles.fieldTitle}>Solo 승률</div>
                            <div className={styles.percentText}>{`${parseInt(info?.winSolo / info?.totalSolo * 100) ?? 0}%`}</div>
                          </div>
                          <div className={styles.splitterVertical} />
                          <div className={styles.myInfoCol}>
                            <div className={styles.fieldTitle}>Team 승률</div>
                            <div className={styles.percentText}>{`${parseInt(info?.winTeam / (info?.totalTeam) * 100) ?? 0}%`}</div>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.btn} onClick={onClick}>닫기</div>
                </div>
                {/* <div className={styles.popupBtn} onClick={onClick}>{label}</div> */}
            </div>
        // </div>
    )
}