import { EffectComposer, Bloom, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { useGame } from './store';

export default function Effects() {
  const { quality, grain, bloom } = useGame((s) => s.settings);
  if (quality === 'low') return null;
  return (
    <EffectComposer multisampling={0}>
      {bloom ? <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.35} radius={0.5} /> : <></>}
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      {grain ? <Noise premultiply={false} blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.16} /> : <></>}
    </EffectComposer>
  );
}
