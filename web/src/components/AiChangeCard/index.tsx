/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import CheckScene from './CheckScene';
import { SceneConfig, updateScene } from '@/store/slices/room';
import { useScene } from '@/lib/useCommon';
import style from './index.module.less';

function AIChangeCard() {
  const { scene, sceneConfigMap } = useSelector((state: RootState) => state.room);
  const dispatch = useDispatch();
  const { icon, isVision } = useScene();
  const Scenes = Object.keys(sceneConfigMap).map((key) => sceneConfigMap[key]);

  const handleChecked = (checkedScene: string) => {
    dispatch(updateScene(checkedScene));
  };

  return (
    <div className={style.card}>
      <div className={style.avatar}>
        <img id="avatar-card" src={icon} alt="Avatar" />
      </div>
      <div className={style.title}>
        <div>Hi，欢迎体验实时对话式 AI</div>
        <div className={style.desc}>
          {isVision ? <>支持豆包 Vision 模型和 深度思考模型，</> : ''}
          超多对话场景等你开启
        </div>
      </div>
      <div className={style.sceneContainer}>
        {Scenes.map((key: SceneConfig) => (
          <CheckScene
            key={key.name}
            icon={key.icon}
            title={key.name}
            checked={key.id === scene}
            onClick={() => handleChecked(key.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default AIChangeCard;
