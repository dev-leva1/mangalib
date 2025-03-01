import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getProfile, updateProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';

const ProfileContainer = styled.div`
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.textPrimary};
`;

const ProfileCard = styled.div`
  background-color: ${props => props.theme.backgroundLight};
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 2rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.textPrimary};
`;

const Email = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const JoinDate = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const EditButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.accent};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.accentDark};
  }
`;

const Form = styled.form`
  margin-top: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.textPrimary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const SaveButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: ${props => props.theme.accent};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.accentDark};
  }
`;

const CancelButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: transparent;
  color: ${props => props.theme.textPrimary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.backgroundLighter};
  }
`;

const StatsSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.textPrimary};
`;

const StatsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.accent};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
`;

const Profile = ({ 
  getProfile, 
  updateProfile, 
  auth: { user }, 
  profile: { profile, loading } 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    website: '',
    favoriteGenres: ''
  });
  
  useEffect(() => {
    getProfile();
  }, [getProfile]);
  
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        favoriteGenres: profile.favoriteGenres ? profile.favoriteGenres.join(', ') : ''
      });
    }
  }, [profile]);
  
  const { bio, location, website, favoriteGenres } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = e => {
    e.preventDefault();
    
    // Преобразуем строку жанров в массив
    const profileData = {
      ...formData,
      favoriteGenres: favoriteGenres.split(',').map(genre => genre.trim()).filter(genre => genre)
    };
    
    updateProfile(profileData);
    setIsEditing(false);
  };
  
  if (loading || !user) {
    return <Spinner />;
  }
  
  return (
    <ProfileContainer>
      <Title>Мой профиль</Title>
      
      <ProfileCard>
        <ProfileHeader>
          <Avatar>
            <img src={user.avatar || 'https://via.placeholder.com/150'} alt={user.name} />
          </Avatar>
          
          <UserInfo>
            <Username>{user.name}</Username>
            <Email>{user.email}</Email>
            <JoinDate>Дата регистрации: {new Date(user.date).toLocaleDateString()}</JoinDate>
            
            {!isEditing && (
              <EditButton onClick={() => setIsEditing(true)}>
                Редактировать профиль
              </EditButton>
            )}
          </UserInfo>
        </ProfileHeader>
        
        {isEditing ? (
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label htmlFor="bio">О себе</Label>
              <TextArea
                id="bio"
                name="bio"
                value={bio}
                onChange={onChange}
                placeholder="Расскажите о себе"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="location">Местоположение</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={onChange}
                placeholder="Город, страна"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="website">Веб-сайт</Label>
              <Input
                type="text"
                id="website"
                name="website"
                value={website}
                onChange={onChange}
                placeholder="https://example.com"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="favoriteGenres">Любимые жанры</Label>
              <Input
                type="text"
                id="favoriteGenres"
                name="favoriteGenres"
                value={favoriteGenres}
                onChange={onChange}
                placeholder="Сёнэн, Фэнтези, Боевик"
              />
            </FormGroup>
            
            <ButtonGroup>
              <SaveButton type="submit">Сохранить</SaveButton>
              <CancelButton type="button" onClick={() => setIsEditing(false)}>
                Отмена
              </CancelButton>
            </ButtonGroup>
          </Form>
        ) : (
          <>
            {profile && (
              <>
                {profile.bio && (
                  <div>
                    <SectionTitle>О себе</SectionTitle>
                    <p>{profile.bio}</p>
                  </div>
                )}
                
                {(profile.location || profile.website || profile.favoriteGenres) && (
                  <StatsSection>
                    <SectionTitle>Информация</SectionTitle>
                    <StatsList>
                      {profile.location && (
                        <StatCard>
                          <StatLabel>Местоположение</StatLabel>
                          <div>{profile.location}</div>
                        </StatCard>
                      )}
                      
                      {profile.website && (
                        <StatCard>
                          <StatLabel>Веб-сайт</StatLabel>
                          <div>
                            <a href={profile.website} target="_blank" rel="noopener noreferrer">
                              {profile.website}
                            </a>
                          </div>
                        </StatCard>
                      )}
                      
                      {profile.favoriteGenres && profile.favoriteGenres.length > 0 && (
                        <StatCard>
                          <StatLabel>Любимые жанры</StatLabel>
                          <div>{profile.favoriteGenres.join(', ')}</div>
                        </StatCard>
                      )}
                    </StatsList>
                  </StatsSection>
                )}
              </>
            )}
          </>
        )}
        
        <StatsSection>
          <SectionTitle>Статистика</SectionTitle>
          <StatsList>
            <StatCard>
              <StatValue>{profile?.readingList?.length || 0}</StatValue>
              <StatLabel>В списке чтения</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{profile?.completedList?.length || 0}</StatValue>
              <StatLabel>Прочитано</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{profile?.favoriteList?.length || 0}</StatValue>
              <StatLabel>В избранном</StatLabel>
            </StatCard>
          </StatsList>
        </StatsSection>
      </ProfileCard>
    </ProfileContainer>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getProfile, updateProfile })(Profile); 