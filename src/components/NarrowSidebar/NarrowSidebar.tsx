import React from 'react'
import classNames from 'classnames'
import {SIDEBAR_NAVIGATION} from "../../constants";
import {useRouter} from "next/router";
import Link from 'next/link'


const NarrowSideBar = () => {
    const {pathname} = useRouter()

    return (
        <div className="hidden w-28 bg-polarBlack bg-hero-pattern overflow-y-auto md:block rounded-tr-xl rounded-br-xl">
            <div className="w-full py-6 flex flex-col items-center">
                <div className="flex-shrink-0 flex items-center">
                    <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                        alt="Workflow"
                    />
                </div>
                <div className="flex-1 mt-6 w-full px-2 space-y-1">
                    {SIDEBAR_NAVIGATION.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}

                            aria-current={item.href === pathname ? 'page' : undefined}
                        >
                            <div className={classNames(
                                item.href === pathname ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800 hover:text-white',
                                'group w-full p-3 rounded-md flex flex-col items-center text-xs font-medium cursor-pointer'
                            )}>
                                <item.icon
                                    className={classNames(
                                        item.href === pathname ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                                        'h-6 w-6'
                                    )}
                                    aria-hidden="true"
                                />
                                <span className="mt-2">{item.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default NarrowSideBar