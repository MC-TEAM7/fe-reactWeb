import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

//차트 그리기 위함
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import HeaderTitle from './components/HeaderTitle';
import Layout from './layout/Layout';
import WatchCam from './components/WatchCam';
import InformTable from './components/InformTable';
// import PeopleNum from './db/PeopleNum';

function App() {
  const [imageURL, setImageURL] = useState('');
  const [dataset, setDataset] = useState([]);

  ////////////////////////////DB백엔드 데이터//////////////////////////
  const [backendData, setBackendData] = useState([{}])
  const [backendData2, setBackendData2] = useState([{}]) //강수량
  ////////////////////////////////////////////////////////////////////

  useEffect(() => {
    // backednAPI를 통해 데이터를 가져옴/////////////////////////////////
    const getlastbackendData = async () => {
      try{
        const response = await fetch("/list");
        const data = await response.json();
        setBackendData(data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    //////////////////////////////////////////////////////////////////////

    const getlastbackendData2 = async () => {
      try{
        const response = await fetch("/water");
        const data = await response.json();
        setBackendData2(data);
      } catch (error) {   
        console.log("Error fetching data:", error);
      }
    };
    //////////////////////////////////////////////////////////////////////
    
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
    getlastbackendData();
    getlastbackendData2();

    // 2초마다 데이터를 가져옴
    const interval = setInterval(() => {
      getlatestImg();
      getlatestDataset();
      getlastbackendData();
      getlastbackendData2();
    }, 2000);

    // 언마운트 시 인터벌 해제
    return () => clearInterval(interval);
  },[]);




  return (
    <Layout headerTtile={<HeaderTitle />}>
      <div className='img-imformation'>
        <WatchCam image={imageURL} />
        <InformTable id={dataset.id} location={dataset.location} time={dataset.time} date={dataset.date} />
        {/* <InformTable /> */}
      </div>

      {/* 차트그리는 파트 */}
      <div className='people-num-chart'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={backendData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time_str" />
            <YAxis dataKey="count" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

        {/* 차트그리는 파트(유량, 강수량)*/}
        <div className='waterflux-chart'>
          <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={backendData2}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="wf" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="ws" stroke="#82ca9d" />
            <Line type="monotone" dataKey="rain" stroke="#c42341" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
} 

export default App;
