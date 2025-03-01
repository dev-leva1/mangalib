import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getFavorites, getReadingHistory } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import MangaGrid from '../manga/MangaGrid';
import ReadingHistoryItem from '../profile/ReadingHistoryItem';

const ProfileContainer = styled.div`
  padding: 2rem 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  color: ${({ theme }) => theme.buttonText};
  font-size: 2.5rem;
  font-weight: bold;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const Email = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const JoinDate = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.9rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  border-bottom: 2px solid ${({ theme }) => theme.primary};
  padding-bottom: 0.5rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const EmptyMessage = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-style: italic;
  text-align: center;
  padding: 2rem;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Profile = ({
  auth: { user, loading: authLoading },
  profile: { favorites, readingHistory, loading: profileLoading },
  getFavorites,
  getReadingHistory
}) => {
  useEffect(() => {
    getFavorites();
    getReadingHistory();
  }, [getFavorites, getReadingHistory]);

  if (authLoading || profileLoading || !user) {
    return <Spinner />;
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProfileContainer>
      <ProfileHeader>
        <Avatar>{getInitials(user.name)}</Avatar>
        <UserInfo>
          <Username>{user.name}</Username>
          <Email>{user.email}</Email>
          <JoinDate>Дата регистрации: {formatDate(user.date)}</JoinDate>
        </UserInfo>
      </ProfileHeader>

      <Section>
        <SectionTitle>Избранное</SectionTitle>
        {favorites && favorites.length > 0 ? (
          <MangaGrid manga={favorites} />
        ) : (
          <EmptyMessage>У вас пока нет избранной манги</EmptyMessage>
        )}
      </Section>

      <Section>
        <SectionTitle>История чтения</SectionTitle>
        {readingHistory && readingHistory.length > 0 ? (
          <HistoryList>
            {readingHistory.map((item) => (
              <ReadingHistoryItem key={item._id} historyItem={item} />
            ))}
          </HistoryList>
        ) : (
          <EmptyMessage>История чтения пуста</EmptyMessage>
        )}
      </Section>
    </ProfileContainer>
  );
};

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getFavorites: PropTypes.func.isRequired,
  getReadingHistory: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getFavorites, getReadingHistory })(
  Profile
); 