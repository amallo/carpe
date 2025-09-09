import { createSelector } from '@reduxjs/toolkit';
import { messageAdapter, selectBroadcastedById, selectSubmittedById, selectPublicMessageIds, selectMessageState } from '../../../core/message/store/message.slice';
import { selectCurrentIdentity } from '../../../core/identity/store/identity.slice';
import { useAppSelector } from '../../store/hooks';

export type PublicMessageStatus = 'submitted' | 'broadcasted' | 'unknown';

export interface PublicMessageViewModel {
  id: string;
  content: string;
  status: PublicMessageStatus;
  sentBy: string;
  timestamp: string;
  distance: number;
  signalStrength: number;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  range: 'local' | 'medium' | 'long';
  isMe: boolean;
}


// Sélecteur mémorisé pour les messages publics avec statut
export const selectPublicMessagesWithStatus = createSelector(
  [
    selectMessageState,
    selectPublicMessageIds,
    selectSubmittedById,
    selectBroadcastedById,
    selectCurrentIdentity,
  ],
  (messageState, publicIds, submittedById, broadcastedById, currentIdentity): PublicMessageViewModel[] => {
    return publicIds.map(id => {
      const message = messageAdapter.getSelectors().selectById(messageState, id);
      return {
        id: id,
        content: message.content,
        status: submittedById[id] ? 'submitted' : broadcastedById[id] ? 'broadcasted' : 'unknown',
        sentBy: message.sentBy === currentIdentity?.id ? 'Moi' : (currentIdentity?.nickname ? currentIdentity.nickname.substring(0, 2).toUpperCase() : 'UN'),
        timestamp: message.sentAt,
        distance: 0,
        signalStrength: 0,
        location: {
          latitude: 0,
          longitude: 0,
          name: '',
        },
        range: 'local',
        isMe: message.sentBy === currentIdentity?.id,
      };
    });
  }
);

export function usePublicMessageListViewModel() {
  const messages = useAppSelector(selectPublicMessagesWithStatus);
  return {
    messages: messages,
  };
}
