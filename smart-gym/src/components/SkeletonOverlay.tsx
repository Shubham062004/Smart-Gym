/**
 * SkeletonOverlay.tsx
 * Renders a real-time SVG skeleton + joint dots on top of the camera feed.
 * Keypoints are normalised [0,1]; we scale to the actual view dimensions.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { SKELETON_CONNECTIONS } from '../ml/postureAnalyzer';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const MIN_SCORE = 0.3;

// ── Types ────────────────────────────────────────────────────────────────────

export interface Keypoint {
  name: string;
  x: number;
  y: number;
  score: number;
}

interface SkeletonOverlayProps {
  keypoints?: Keypoint[];
  postureScore?: number;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const jointColor = (score: number): string => {
  if (score >= 0.7) return '#0df20d';   // green – high confidence
  if (score >= 0.4) return '#f97316';   // orange – medium
  return '#ef4444';                      // red – low confidence
};

const boneColor = (scoreA: number, scoreB: number, postureScore: number): string => {
  const minConf = Math.min(scoreA, scoreB);
  if (minConf < MIN_SCORE) return 'rgba(255,255,255,0.1)';
  if (postureScore >= 90) return 'rgba(13,242,13,0.7)';
  if (postureScore >= 70) return 'rgba(249,115,22,0.7)';
  return 'rgba(239,68,68,0.7)';
};

// ── Component ────────────────────────────────────────────────────────────────

const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({
  keypoints = [],
  postureScore = 0,
  width = SCREEN_W,
  height = SCREEN_H,
  showLabels = false,
}) => {
  const kpMap = useMemo(() => {
    const map: Record<string, Keypoint> = {};
    keypoints.forEach((kp) => { map[kp.name] = kp; });
    return map;
  }, [keypoints]);

  if (keypoints.length === 0) return null;

  return (
    <View style={[styles.overlay, { width, height }]} pointerEvents="none">
      <Svg width={width} height={height}>
        {/* ── Bones ──────────────────────────────────────────────── */}
        <G>
          {SKELETON_CONNECTIONS.map(([nameA, nameB]: [string, string], idx: number) => {
            const a = kpMap[nameA];
            const b = kpMap[nameB];
            if (!a || !b || a.score < MIN_SCORE || b.score < MIN_SCORE) return null;
            return (
              <Line
                key={`bone-${idx}`}
                x1={a.x * width}
                y1={a.y * height}
                x2={b.x * width}
                y2={b.y * height}
                stroke={boneColor(a.score, b.score, postureScore)}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            );
          })}
        </G>

        {/* ── Joints ─────────────────────────────────────────────── */}
        <G>
          {keypoints.map((kp) => {
            if (kp.score < MIN_SCORE) return null;
            const cx = kp.x * width;
            const cy = kp.y * height;
            const color = jointColor(kp.score);
            return (
              <G key={`joint-${kp.name}`}>
                <Circle cx={cx} cy={cy} r={9} fill={`${color}22`} />
                <Circle cx={cx} cy={cy} r={5} fill={color} />
                <Circle cx={cx} cy={cy} r={2} fill="#fff" />
                {showLabels && (
                  <SvgText
                    x={cx + 8}
                    y={cy - 8}
                    fontSize={8}
                    fill="rgba(255,255,255,0.7)"
                    fontWeight="bold"
                  >
                    {kp.name.replace('_', ' ')}
                  </SvgText>
                )}
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default SkeletonOverlay;
