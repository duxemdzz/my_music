/** 
 * 1. Render songs
 * 2. Sroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next/ prev
 * 6. Random
 * 7. Next/ Repeat when anded
 * 8. Active songs
 * 9. Scroll active song into view
 * 10. Play song when click

*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const PLAYER_STORAGE_KEY = 'F8_PLAYER';
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'Waiting for you',
            singer: 'Mono',
            path: '../assets/music/waitingforyou_mono.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Em Bước đi thật vội vàng',
            singer: 'Datkaa',
            path: '../assets/music/embuocdithatvoivang_datkaa.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Đám cưới nha',
            singer: 'Hồng Thanh',
            path: '../assets/music/damcuoinha_hongthanh.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Mang tiền về cho mẹ',
            singer: 'Đen Vâu',
            path: '../assets/music/mangtienvechome_den.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Đế Vương',
            singer: 'Đình Dũng',
            path: '../assets/music/devuong_dinhdung.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Đế Vương',
            singer: 'Phạm Hoàng Dung',
            path: '../assets/music/devuong_coverbyhoangdungpham.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Nhạc Hot Tiktok',
            singer: 'EDM',
            path: '../assets/music/hottiktok_edm.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Ở bên ai liệu em có thấy vui',
            singer: 'Phạm Hoàng Dung',
            path: '../assets/music/obenailieuemcothayvui_lofi.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Hoa trên giấy không sương hoa vẫn nở',
            singer: 'NoName',
            path: '../assets/music/hoatrengiaykhongsuonghoavanno_noname.mp3',
            image: '../assets/img/du.jpg'
        },
        {
            name: 'Chỉ là muốn nói',
            singer: 'dubq',
            path: '../assets/music/chimuonnoila_coverbydubq.m4a',
            image: '../assets/img/Me.jpg'
        }

    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}" >
                <div class="thumb"
                    style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },



    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' },
        ], {
            duration: 10000,
            iterations: Infinity
        }
        )

        cdThumbAnimate.pause()

        // xử lí khi phóng to / thu nhỏ
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        },

            // Xử lí khi click play
            playBtn.onclick = function () {
                if (_this.isPlaying) {
                    audio.pause()
                } else {
                    audio.play()
                }

            }
        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        progress.onchange = function (e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        },
            // Xử lí bật tắt random song
            randomBtn.onclick = function () {
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active', _this.isRandom)

            }

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lí next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        },
            // Lắng nghe hành vi click vao playlist
            playlist.onclick = function (e) {
                const songNode = e.target.closest('.song:not(.active');
                if (songNode || e.target.closest('.option')) {
                    if (songNode) {
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        audio.play()
                        _this.render()
                    }
                }
            }


    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 500)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.render()
        this.scrollToActiveSong()
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
        this.render()
        this.scrollToActiveSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // định nghĩa các thuộc tính cho Object
        this.defineProperties()


        // Lắng nghe / xử lí sự kiện (DOM event)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dungj
        this.loadCurrentSong()


        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu của button repeat & random
            randomBtn.classList.toggle('active', this.isRandom)
            repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start();