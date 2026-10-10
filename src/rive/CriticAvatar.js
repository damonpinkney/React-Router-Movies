import React, { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

// avatars.riv (Rive community "Avatar Pack") has three artboards, each with
// its own state machine and two boolean inputs: isHappy and isSad.
const AVATARS = [
  { artboard: 'Avatar 1', stateMachine: 'avatar' },
  { artboard: 'Avatar 2', stateMachine: 'avatar2' },
  { artboard: 'Avatar 3', stateMachine: 'avatar3' },
];

export function moodFor(metascore) {
  if (metascore >= 90) return 'happy';
  if (metascore < 80) return 'sad';
  return 'neutral';
}

export default function CriticAvatar({ id, metascore }) {
  const { artboard, stateMachine } = AVATARS[id % AVATARS.length];
  const mood = moodFor(metascore);

  const { rive, RiveComponent } = useRive({
    src: `${process.env.PUBLIC_URL}/rive/avatars.riv`,
    artboard,
    stateMachine,
    autoplay: true,
  });
  const isHappy = useStateMachineInput(rive, stateMachine, 'isHappy');
  const isSad = useStateMachineInput(rive, stateMachine, 'isSad');

  useEffect(() => {
    if (isHappy) isHappy.value = mood === 'happy';
    if (isSad) isSad.value = mood === 'sad';
  }, [isHappy, isSad, mood]);

  return (
    <RiveComponent
      className="critic-avatar"
      role="img"
      aria-label={`Critic is ${mood} about a metascore of ${metascore}`}
    />
  );
}
