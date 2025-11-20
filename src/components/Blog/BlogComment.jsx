import React from 'react';
import userImg from '../../images/avatar.jpg';
import { Button } from 'antd';

const BlogComment = () => {
    return (
        <div className='mx-3' style={{ marginTop: '7rem' }}>
            <h5 className="mb-5" style={{ fontWeight: '900' }}>COMMENTS</h5>

            {
                Array(4).fill(null).map((_item, index) => (
                    <div className='d-flex gap-3 mb-3' key={index + 5}>
                        <div>
                            <img src={userImg} width={80} className='' alt='User Profile' />
                        </div>
                        <div>
                            <div className='mb-2'>
                                <h6>{['Dr. Sarah Johnson', 'Michael Chen', 'Dr. David Brown', 'Emily Rodriguez'][index]}</h6>
                                <p className='form-text mb-0'>{['August 2023', 'September 2023', 'October 2023', 'November 2023'][index]}</p>
                            </div>
                            <p className='form-text'>
                                {[
                                    'This is an excellent article about healthcare! The information provided is very helpful and well-researched. I particularly appreciate the practical tips and professional insights shared here.',
                                    'As a healthcare professional, I find this content extremely valuable. The research-based approach and practical recommendations make it a great resource for both patients and practitioners.',
                                    'Very informative and well-written article. The healthcare tips provided are practical and easy to implement in daily life. Looking forward to more content like this.',
                                    'Excellent healthcare insights! The article covers important topics that everyone should be aware of. The professional perspective adds credibility to the information shared.'
                                ][index]}
                            </p>
                        </div>
                    </div>
                ))
            }

            <div className="mx-auto" style={{ marginTop: '7rem', marginBottom: '7rem' }}>

                <div className="card mb-5 p-3 shadow border-0">
                    <form className="row form-row">
                        <div className="col-md-6">
                            <div className="form-group mb-2 card-label">
                                <label>First Name</label>
                                <input placeholder='First Name' className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mb-2 card-label">
                                <label>Last Name</label>
                                <input placeholder='Last Name' className="form-control" />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="form-group mb-2 card-label">
                                <label>Subject</label>
                                <input placeholder='Subject' className="form-control" />
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="form-group mb-2 card-label">
                                <label>Comment</label>
                                <textarea placeholder='Your Comment' className="form-control" rows={5} />
                            </div>
                        </div>

                        <div className='text-center my-3'>
                            <Button htmlType='submit' type="primary" size='large'>
                                Comment
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BlogComment