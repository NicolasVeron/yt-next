import {
    Home,
    ExploreOutlined,
    SubscriptionsOutlined,
    LibraryAddOutlined,
    HistoryOutlined,
    LibraryMusicOutlined,
    SportsBasketballOutlined,
    SportsEsportsOutlined, //VideogameAssetOutlined
    MovieCreationOutlined,
    FeedOutlined,
 } from '@mui/icons-material'

 export const sideCategories = [
    {
        href: "/feed/music",
        icon: <LibraryMusicOutlined/>,
        name: "Music"
    },
    {
        href: "/feed/sports",
        icon: <SportsBasketballOutlined/>,
        name: "Sports"
    },
    {
        href: "/feed/gaming",
        icon: <SportsEsportsOutlined/>,
        name: "Gaming"
    },
    {
        href: "/feed/movies",
        icon: <MovieCreationOutlined/>,
        name: "Movies"
    },
    {
        href: "/feed/news",
        icon: <FeedOutlined/>,
        name: "News"
    },
 ]