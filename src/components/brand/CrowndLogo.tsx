import React from 'react';
import Svg, { G, Path, ClipPath, Rect, Defs } from 'react-native-svg';
import { Colors } from '../../theme';

interface CrowndLogoProps {
  size?: number;
  color?: string;
}

export function CrowndLogo({ size = 40, color = Colors.primary }: CrowndLogoProps) {
  // Original viewBox: 47 x 34 — scale to requested size preserving ratio
  const width = size;
  const height = (size / 47) * 34;

  return (
    <Svg width={width} height={height} viewBox="0 0 47 34" fill="none">
      <Defs>
        <ClipPath id="crownd_clip0">
          <Rect width="47" height="34" fill="white" />
        </ClipPath>
        <ClipPath id="crownd_clip1">
          <Rect width="47" height="34" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#crownd_clip0)">
        <G clipPath="url(#crownd_clip1)">
          <Path
            d="M29.4889 28.7161L23.6818 21.3186L17.8747 28.7161L6.45459 24.4889L10.0352 34H23.6818H37.3304L40.911 24.4889L29.4889 28.7161Z"
            fill={color}
          />
          <Path
            d="M16.2692 21.5503L7.08983 9.03144L10.2293 6.77765L16.8983 20.4244L16.2692 21.5503Z"
            fill={color}
          />
          <Path
            d="M22.3868 0L23.0588 17.7235L23.6818 17.569L24.3354 17.3861L24.9788 0.418649"
            fill={color}
          />
          <Path
            d="M29.5011 21.154L36.5419 6.19844L39.469 7.45845L30.022 21.7067L29.5011 21.154Z"
            fill={color}
          />
          <Path
            d="M42.5165 22.2412L47 18.1889L45.3925 16.8049L41.9814 21.9222L42.5165 22.2412Z"
            fill={color}
          />
          <Path
            d="M4.48349 22.2412L0 18.1889L1.49722 16.6403L5.10035 22.0441L4.48349 22.2412Z"
            fill={color}
          />
        </G>
      </G>
    </Svg>
  );
}
