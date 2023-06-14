import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

import HeaderTitle from './components/HeaderTitle';
import Layout from './layout/Layout';
import WatchCam from './components/WatchCam';
import InformTable from './components/InformTable';

function App() {
  const [imageURL, setImageURL] = useState('');
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    AWS.config.update({
      region: 'eu-west-2',
      accessKeyId: 'AKIA5VZTIAOJ5WLDE5PE',                    //IAM에서 받아오기
      secretAccessKey: 'LUGWzBaJtKy2lDGvaIrVm07+3AkRWgGVckCRTvXA',
    });

    const s3Img = new AWS.S3();
    // const paramsImg = {
    //   Bucket: 'team7-cam',
    //   Key: 'react.png',
    // };

    // const imageUrl = s3Img.getSignedUrl('getObject', paramsImg);
    // setImageURL(imageUrl);
    const s3Data = new AWS.S3();
    // 버킷에서 dataSet을 가져오는 Test Code가 작동확인 -> 최근 데이터를 볼 수 있도록 Check
    // const paramsData = {
    //   Bucket: 'team7-data',
    //   Key: 'test.json',
    // };    
    //
    // s3Data.getObject(paramsData, (err, data) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     const dataset = JSON.parse(data.Body.toString());
    //     setDataset(dataset);
    //   }
    // });
    const getlatestImg = async () => {
      try {
        const response = await s3Img.listObjectsV2({
          Bucket: "team7-cam",
          MaxKeys: 100, // 조회할 최대 객체 수
        }).promise();

        const sortedObjects = response.Contents.sort((a, b) => {
          return new Date(b.LastModified) - new Date(a.LastModified);
        });

        if (sortedObjects.length > 0) {
          // 가장 최신 객체의 키 가져오기
          const latestObjectKey = sortedObjects[0].Key;

          const paramsLatestImg = {
            Bucket: "team7-cam",
            Key: latestObjectKey,
          };
          const imageUrl = s3Img.getSignedUrl('getObject', paramsLatestImg);
          setImageURL(imageUrl);
        } else
          // 최신 객체가 없는 경우 빈 배열로 설정
          setImageURL([])

      } catch (error) {
        console.log("Error retrieving S3 objects:", error);
      }
    };
    const getlatestDataset = async () => {
      try {
        // 데이터 버킷에서 객체 목록 조회
        const response = await s3Data.listObjectsV2({
          Bucket: "team7-data",
          MaxKeys: 100, // 조회할 최대 객체 수
        }).promise();

        // 객체 목록을 최근 수정일 기준으로 내림차순 정렬
        const sortedObjects = response.Contents.sort((a, b) => {
          return new Date(b.LastModified) - new Date(a.LastModified);
        });

        if (sortedObjects.length > 0) {
          // 가장 최신 객체의 키 가져오기
          const latestObjectKey = sortedObjects[0].Key;

          const paramsLatestData = {
            Bucket: "team7-data",
            Key: latestObjectKey,
          };

          // 최신 데이터 가져오기
          s3Data.getObject(paramsLatestData, (err, data) => {
            if (err) {
              console.log(err);
            } else {
              const dataset = JSON.parse(data.Body.toString());
              setDataset(dataset);
              console.log(dataset);
            }
          });
        } else {
          // 최신 객체가 없는 경우 빈 배열로 설정
          setDataset([]);
        }
      } catch (error) {
        console.log("Error retrieving S3 objects:", error);
      }
    };
    getlatestImg();
    getlatestDataset();
  });

  return (
    <Layout headerTtile={<HeaderTitle />}>
      <WatchCam image={imageURL} />
      <InformTable id={dataset.id} location={dataset.location} time={dataset.time} date={dataset.date} />
      {/* <InformTable /> */}
    </Layout>
  );
}

export default App;
