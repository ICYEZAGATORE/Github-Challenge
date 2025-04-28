import { useState, useEffect } from "react";

export default function GitHubUserSearch() {

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);

   
    loadDefaultUser();
  }, []);

 
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);


  function loadDefaultUser() {
    setUser({
      login: "octocat",
      name: "The Octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      bio: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros.",
      created_at: "2011-01-25T18:44:36Z",
      public_repos: 8,
      followers: 3938,
      following: 9,
      location: "San Francisco",
      blog: "https://github.blog",
      twitter_username: "github",
      company: null,
    });
  }


  function searchUser(e) {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            response.status === 404 ? "User not found" : "Error fetching user"
          );
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setUser(null);
        setLoading(false);
      });
  }


  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">devfinder</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 uppercase text-sm font-bold hover:opacity-80 transition-opacity"
          >
            {darkMode ? "LIGHT 🌞" : "DARK 🌙"}
          </button>
        </header>

       
        <form onSubmit={searchUser} className="mb-6">
          <div
            className={`flex items-center rounded-lg shadow-md overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <span className="pl-4 pr-2 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow p-4 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 m-2 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500 font-bold">{error}</p>}
        </form>


        {user && (
          <div
            className={`rounded-lg shadow-lg p-6 ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex flex-col md:flex-row gap-6">
             
              <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28">
                <img
                  src={user.avatar_url}
                  alt={`${user.login}'s avatar`}
                  className="w-full h-full rounded-full"
                />
              </div>


              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
                  <div>
                    <h2
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.name || user.login}
                    </h2>
                    <a
                      href={`https://github.com/${user.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      @{user.login}
                    </a>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                    Joined {formatDate(user.created_at)}
                  </p>
                </div>


                <p className={`mb-6 ${!user.bio && "opacity-70 italic"}`}>
                  {user.bio || "This profile has no bio"}
                </p>


                <div
                  className={`grid grid-cols-3 gap-4 rounded-lg p-4 mb-6 ${
                    darkMode ? "bg-gray-900" : "bg-gray-100"
                  }`}
                >
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Repos
                    </p>
                    <p
                      className={`font-bold text-lg ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.public_repos}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Followers
                    </p>
                    <p
                      className={`font-bold text-lg ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.followers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Following
                    </p>
                    <p
                      className={`font-bold text-lg ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {user.following}
                    </p>
                  </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`flex items-center gap-3 ${
                      !user.location && "opacity-50"
                    }`}
                  >
                    <span>📍</span>
                    <span>{user.location || "Not available"}</span>
                  </div>
                  <div
                    className={`flex items-center gap-3 ${
                      !user.blog && "opacity-50"
                    }`}
                  >
                    <span>🔗</span>
                    {user.blog ? (
                      <a
                        href={
                          user.blog.startsWith("http")
                            ? user.blog
                            : `https://${user.blog}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline truncate"
                      >
                        {user.blog}
                      </a>
                    ) : (
                      <span>Not available</span>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-3 ${
                      !user.twitter_username && "opacity-50"
                    }`}
                  >
                    <span>🐦</span>
                    {user.twitter_username ? (
                      <a
                        href={`https://twitter.com/${user.twitter_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        @{user.twitter_username}
                      </a>
                    ) : (
                      <span>Not available</span>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-3 ${
                      !user.company && "opacity-50"
                    }`}
                  >
                    <span>🏢</span>
                    <span>{user.company || "Not available"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
