import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import styles from './InstructorDashboardLayout.module.css';

const InstructorDashboardLayout = () => {
    const location = useLocation();

    return (
        <div className={styles.dashboard}>
            <aside className={styles.sidebar}>
                <h2 className={styles.logo}><Link to="/instructor">Instructor</Link></h2>
                <nav>
                    <ul>
                        <li className={location.pathname.includes('/courses') ? styles.active : ''}>
                            <Link to="/instructor/courses">Khóa học</Link>
                        </li>
                        {/* Thêm các mục khác sau: Phân tích, Công cụ, ... */}
                    </ul>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default InstructorDashboardLayout;