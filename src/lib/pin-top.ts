export function pinTopTimeout(el: HTMLElement, time: number = 1000, root:HTMLElement = document.documentElement) {
  const endTime = Date.now() + time

  const doPin = () => {
    root.scrollTo({
      top: el.offsetTop,
      behavior: 'smooth'
    })

    const now = Date.now()
    if (now >= endTime) { return }
    setTimeout(doPin, 100)
  }

  doPin()
}
