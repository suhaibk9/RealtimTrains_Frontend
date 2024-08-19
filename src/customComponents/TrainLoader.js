import React from 'react';

const TrainLoader = ({ message }) => {
  return (
    <>
      <style>
        {`
          /* Ensure the loader covers the entire viewport */
          .loader-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to right,
              rgba(86, 204, 242, 0.7), /* semi-transparent blue */
              rgba(47, 128, 237, 0.7)  /* semi-transparent darker blue */
            );
            z-index: 10000; /* High z-index to overlay everything */
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }

          .train-container {
            position: relative;
            width: 109px;
            transform: scale(1.2);
          }

          .engine-head {
            float: right;
            position: relative;
          }

          .engine-window {
            height: 28px;
            width: 30px;
            background-color: #194488;
            position: relative;
            border: 3px solid #000;
          }

          .engine-window:before,
          .engine-window:after {
            content: "";
            position: absolute;
            left: 50%;
            border: 3px solid #000;
          }

          .engine-window:before {
            height: 7px;
            background-color: #F82510;
            width: 45px;
            margin-top: -13px;
            margin-left: -26px;
            border-radius: 8px;
          }

          .engine-window:after {
            margin-left: -8px;
            margin-top: 3px;
            border-radius: 50%;
            height: 11px;
            width: 11px;
            background-color: #fff;
          }

          .engine-body {
            height: 10px;
            width: 35px;
            border: 3px solid #000;
            background-color: #3D9A01;
            position: absolute;
            border-radius: 0 8px 8px 0;
            right: -41px;
            bottom: -3px;
          }

          .engine-body:before {
            content: "";
            height: 10px;
            width: 8px;
            background-color: #000;
            position: absolute;
            top: -11px;
            left: 4px;
            transform: rotate(180deg);
            border-radius: 50% 50% 50% 50% / 90% 90% 40% 40%;
          }

          .engine-body:after {
            content: "";
            height: 12px;
            width: 8px;
            position: absolute;
            display: block;
            right: 5px;
            top: -18px;
            border-radius: 50% 50% 50% 50% / 90% 90% 40% 40%;
            transform: rotate(180deg);
            z-index: -1;
            background-color: #194488;
            border: 3px solid #000;
          }

          .engine-base {
            height: 17px;
            width: 75px;
            position: absolute;
            left: -2px;
            top: 30px;
            background-color: #F69F00;
            border: 3px solid #000;
            border-radius: 5px;
          }

          .engine-base .large-wheel {
            top: 3px;
            left: 2px;
          }

          .engine-base .small-wheel {
            left: 45px;
            top: 5px;
          }

          .engine-base:before {
            content: "";
            position: absolute;
            height: 5px;
            width: 5px;
            left: -11px;
            bottom: 2px;
            z-index: -1;
            background-color: #fff;
            border-radius: 50%;
            border: 3px solid #000;
          }

          .wheel-section > div {
            position: absolute;
            background-color: #F82510;
            border-radius: 50%;
            border: 3px solid #000;
            animation: wheel-rotate 1s linear infinite;
          }

          .wheel-section > div:before {
            content: "";
            position: absolute;
            width: 100%;
            border-bottom: 1px solid #000;
            top: 50%;
            margin-top: -1px;
          }

          .wheel-section > div:after {
            content: "";
            height: 8px;
            width: 8px;
            position: absolute;
            background-color: #000;
            border-radius: 50%;
            left: 50%;
            top: 50%;
            margin-left: -4px;
            margin-top: -4px;
          }

          .large-wheel {
            width: 22px;
            height: 22px;
            animation-delay: -0.3s;
          }

          .small-wheel {
            height: 20px;
            width: 20px;
            animation-delay: -0.6s;
          }

          .train-cabin {
            height: 35px;
            width: 60px;
            border: 3px solid #000;
            background-color: #F69F00;
            border-radius: 5px;
            position: relative;
            float: left;
            margin-top: 13px;
          }

          .train-cabin:before {
            content: "";
            width: 100%;
            background: linear-gradient(to right, #000000 0%,#000000 8%,#f69f00 8%,#f69f00 15%,#000000 15%,#000000 28%,#000000 34%,#f69f00 34%,#f69f00 65%,#000000 65%,#000000 65%,#000000 100%);
            height: 3px;
            position: absolute;
            top: 6px;
            left: 0;
          }

          .train-cabin:after {
            content: "";
            width: 100%;
            background: linear-gradient(to right, #000000 0%,#000000 24%,#f69f00 24%,#f69f00 65%,#f69f00 65%,#000000 65%,#000000 85%,#f69f00 85%,#f69f00 90%,#000000 90%, #000000 100%);
            height: 3px;
            position: absolute;
            top: 14px;
            left: 0;
          }

          .train-cabin .wheel-section > div {
            top: 22px;
            animation-delay: -0.6s;
          }

          .train-cabin .wheel-section > div:first-child {
            animation-delay: -0.9s;
          }

          .train-cabin .small-wheel:first-of-type {
            left: 2px;
          }

          .train-cabin .small-wheel:last-of-type {
            right: 2px;
          }

          .cargo {
            height: 35px;
            width: 50px;
            position: absolute;
            top: -18px;
            border: 3px solid #000;
            background-color: #3D9A01;
            border-radius: 50%;
            left: 2px;
            z-index: -1;
          }

          .train-tracks {
            position: relative;
            width: 200px;
            bottom: -10px;
            overflow: hidden;
            height: 3px;
          }

          .train-tracks span {
            display: inline-block;
            height: 3px;
            width: 200px;
            position: absolute;
            left: 200px;
            background: linear-gradient(to right, rgba(0,0,0,1) 0%,rgba(0,0,0,1) 30%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 39%,rgba(0,0,0,1) 39%,rgba(0,0,0,1) 61%,rgba(0,0,0,1) 65%,rgba(0,0,0,0) 65%,rgba(0,0,0,0) 70%,rgba(0,0,0,1) 71%,rgba(0,0,0,1) 100%);
            animation: track-slide 2s linear infinite;
            animation-fill-mode: forwards;
          }

          .train-tracks span:nth-child(2) {
            animation-delay: -1s;
          }

          .smoke-section:before,
          .smoke-section:after,
          .smoke-section span:before {
            display: block;
            content: "";
            height: 8px;
            width: 8px;
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            right: 8px;
            top: 15px;
            z-index: -1;
          }

          .smoke-section:before {
            animation: smoke-puff 1s linear infinite;
          }

          .smoke-section span:before {
            animation: smoke-puff 1s linear infinite;
            animation-delay: -0.6s;
          }

          .smoke-section:after {
            animation: smoke-puff 1s linear infinite;
            animation-delay: -0.3s;
          }

          @keyframes smoke-puff {
            100% {
              top: -50px;
              opacity: 0.5;
            }
          }

          @keyframes wheel-rotate {
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes track-slide {
            100% {
              left: -200px;
            }
          }

          .loading-message {
            margin-top: 20px;
            font-size: 18px;
            color: #fff;
          }
        `}
      </style>
      <div className="loader-overlay">
        <div className="train-container">
          <div className="engine-head">
            <div className="engine-window">
              <div className="engine-body">
                <div className="smoke-section">
                  <span></span>
                </div>
              </div>
            </div>
            <div className="engine-base">
              <div className="wheel-section">
                <div className="large-wheel"></div>
                <div className="small-wheel"></div>
              </div>
            </div>
          </div>
          <div className="train-cabin">
            <div className="cargo"></div>
            <div className="wheel-section">
              <div className="small-wheel"></div>
              <div className="small-wheel"></div>
            </div>
          </div>
          <div className="train-tracks">
            <span></span>
            <span></span>
          </div>
        </div>
        {message && <div className="loading-message">{message}</div>}
      </div>
    </>
  );
};

export default TrainLoader;
