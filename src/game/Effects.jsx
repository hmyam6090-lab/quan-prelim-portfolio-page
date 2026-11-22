import { EffectComposer, Bloom, Vignette, Noise, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { useGame } from './store';

export default function Effects() {
  const { quality, grain, bloom } = useGame((s) => s.settings);
  if (quality === 'low') return null;
  return (
    <EffectComposer multisampling={4}>
      {bloom ? <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.75} radius={0.7} /> : <></>}
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Vignette offset={0.28} darkness={0.55} />
      {grain ? <Noise premultiply={false} blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.32} /> : <></>}
    </EffectComposer>
  );
}
