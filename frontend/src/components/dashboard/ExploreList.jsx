import { EXPLORE } from '../../data/mockData'
import { EXPLORE_IMGS } from '../../data/images'

const ITEMS = EXPLORE.map((e, i) => ({ ...e, img: EXPLORE_IMGS[i] }))

export default function ExploreList() {
  return (
    <section className="el-section">
      <div className="el-hd">
        <span className="el-title">Explore</span>
        <button className="el-viewall">View All →</button>
      </div>
      <div className="el-grid">
        {ITEMS.map((item, i) => (
          <div className="el-card" key={item.name} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="el-img-wrap">
              <img src={item.img} alt={item.name} className="el-img" />
              <span className="el-tag">{item.tag}</span>
            </div>
            <div className="el-info">
              <p className="el-name">{item.name}</p>
              <p className="el-country">{item.country}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
