import { Award, Search, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import AchievementCard from "../components/AchievementCard";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { getAllAchievements } from "../services/achievementService";
import { getAllUsers } from "../services/userService";
import { Achievement, User as UserType } from "../types";

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<UserType | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  useEffect(() => {
    // Use real API
    getAllUsers().then(setUsers);
    getAllAchievements().then(setAchievements);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.teacherId.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleTeacherSelect = (teacher: UserType) => {
    setSelectedTeacher(teacher);
    setSearchQuery("");
    setFilteredUsers([]);
  };

  const getTeacherAchievements = (teacherId: string) => {
    return achievements.filter(
      (achievement) =>
        achievement.teacher === teacherId && achievement.status === "Approved"
    );
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Search Faculty Achievements
        </h1>

        {/* Search Box */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="search"
            type="text"
            placeholder="Search by faculty name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />

          {/* Search Results Dropdown */}
          {filteredUsers.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                  onClick={() => handleTeacherSelect(user)}
                >
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">
                      {user.designation} • ID: {user.teacherId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Teacher Profile */}
        {selectedTeacher && (
          <div className="mb-8">
            <Card className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <div className="h-20 w-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                    <User className="h-10 w-10" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {selectedTeacher.name}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {selectedTeacher.designation}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Faculty ID: {selectedTeacher.teacherId}
                  </p>
                </div>
              </div>
            </Card>

            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary-600" />
              Approved Achievements
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {getTeacherAchievements(selectedTeacher.teacherId).length > 0 ? (
                getTeacherAchievements(selectedTeacher.teacherId).map(
                  (achievement) => (
                    <AchievementCard
                      key={achievement._id}
                      achievement={achievement}
                    />
                  )
                )
              ) : (
                <div className="md:col-span-2 p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    No approved achievements found for this faculty member.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initial Empty State */}
        {!selectedTeacher && (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Search for a faculty member
            </h3>
            <p className="text-gray-600 mb-6">
              Enter a faculty name or ID to view their profile and achievements
            </p>
            <div className="flex justify-center">
              <Button onClick={() => setSearchQuery("Dr.")}>
                View Sample Faculty
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
